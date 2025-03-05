package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Asset;
import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Investment.AssetRepository;
import com.example.ibudgetproject.repositories.Investment.CoinRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealMatrix;
import org.apache.commons.math3.linear.RealVector;
import org.apache.commons.math3.optim.InitialGuess;
import org.apache.commons.math3.optim.MaxEval;
import org.apache.commons.math3.optim.PointValuePair;
import org.apache.commons.math3.optim.SimpleBounds;
import org.apache.commons.math3.optim.nonlinear.scalar.GoalType;
import org.apache.commons.math3.optim.nonlinear.scalar.ObjectiveFunction;
import org.apache.commons.math3.optim.nonlinear.scalar.noderiv.CMAESOptimizer;
import org.apache.commons.math3.random.MersenneTwister;
import org.apache.commons.math3.stat.correlation.Covariance;
import org.apache.commons.math3.stat.descriptive.moment.Mean;
import org.apache.commons.math3.stat.descriptive.moment.StandardDeviation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class AssetServiceImpl implements AssetService {

    private static final int SIMULATIONS = 10000; // Nombre de simulations Monte Carlo
    private static final double CONFIDENCE_LEVEL = 0.95;

    @Autowired
    private AssetRepository assetRepository;
    @Autowired
    private CoinRepository coinRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Asset createAsset(User user, Coin coin, double quantity) {
        Asset asset = new Asset();
        asset.setUser(user);
        asset.setCoin(coin);
        asset.setQuantity(quantity);
        asset.setBuyPrice(coin.getCurrentPrice());
        return assetRepository.save(asset);
    }

    @Override
    public Asset getAssetById(Long assetId) throws Exception {
        return assetRepository.findById(assetId)
                .orElseThrow(() -> new Exception("Asset not found"));
    }

    @Override
    public Asset getAssetByUserIdAndId(Long userId, Long assetId) {
        return null;
    }

    @Override
    public List<Asset> getUsersAssets(Long userId) {
        return assetRepository.findByUser_UserId(userId);
    }

    @Override
    public Asset updateAsset(Long assetId, double quantity) throws Exception {
        Asset oldAsset = getAssetById(assetId);
        oldAsset.setQuantity(quantity);
        return assetRepository.save(oldAsset);
    }

    @Override
    public Asset findAssetByUserIdAndCoinId(Long user_Id, String coinId) {
        return assetRepository.findByUser_UserIdAndCoinId(user_Id, coinId);
    }

    @Override
    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }

    @Override
    public double calculateRiskMonteCarlo(Long userId, int days) {
        List<Asset> assets = assetRepository.findByUser_UserId(userId);
        if (assets.isEmpty()) {
            throw new RuntimeException("Aucun actif trouvé pour l'utilisateur.");
        }

        double portfolioValue = assets.stream()
                .mapToDouble(asset -> asset.getQuantity() * asset.getCoin().getCurrentPrice())
                .sum();

        double[] logReturns = assets.stream()
                .mapToDouble(asset -> {
                    try {
                        return computeLogReturn(fetchHistoricalPrices(asset.getCoin().getId()));
                    } catch (Exception e) {
                        throw new RuntimeException("Erreur lors de la récupération des prix historiques", e);
                    }
                })
                .toArray();

        if (logReturns.length == 0) {
            throw new RuntimeException("Pas assez de données pour effectuer la simulation Monte Carlo.");
        }

        double[] simulatedValues = new double[SIMULATIONS];
        Random random = new Random();

        for (int i = 0; i < SIMULATIONS; i++) {
            double simulatedPortfolioValue = portfolioValue;
            for (int j = 0; j < days; j++) {
                simulatedPortfolioValue *= Math.exp(logReturns[random.nextInt(logReturns.length)]);
            }
            simulatedValues[i] = simulatedPortfolioValue;
        }

        Arrays.sort(simulatedValues);
        return portfolioValue - simulatedValues[(int) (SIMULATIONS * (1 - CONFIDENCE_LEVEL))];
    }

    @Override
    public double calculateAssetValue(Long assetId) throws Exception {
        Asset asset = getAssetById(assetId);
        double currentPrice = asset.getCoin().getCurrentPrice();
        return asset.getQuantity() * currentPrice;
    }

    @Override
    public double computeLogReturn(double[] historicalPrices) {
        if (historicalPrices.length < 2) {
            throw new RuntimeException("Pas assez de données historiques.");
        }
        double[] returns = new double[historicalPrices.length - 1];
        for (int i = 1; i < historicalPrices.length; i++) {
            returns[i - 1] = Math.log(historicalPrices[i] / historicalPrices[i - 1]);
        }
        return new Mean().evaluate(returns) + new StandardDeviation().evaluate(returns) * new Random().nextGaussian();
    }


    private double[] fetchHistoricalPrices(String coinId) throws Exception {
        String url = "https://api.coingecko.com/api/v3/coins/" + coinId + "/market_chart?vs_currency=usd&days=30";
        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            JsonNode pricesArray = jsonNode.get("prices");
            double[] historicalPrices = new double[pricesArray.size()];

            for (int i = 0; i < pricesArray.size(); i++) {
                historicalPrices[i] = pricesArray.get(i).get(1).asDouble();
            }

            return historicalPrices;
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public double[] optimizePortfolioMarkowitz(Long userId) {
        System.out.println("Optimisation du portefeuille pour userId: " + userId);
        List<Asset> assets = assetRepository.findByUser_UserId(userId);
        if (assets.isEmpty()) throw new RuntimeException("Aucun actif trouvé");

        int n = assets.size();
        double[][] returns = new double[n][];
        for (int i = 0; i < n; i++) {
            returns[i] = fetchHistoricalReturns(assets.get(i).getCoin().getId());
            System.out.println("Length of returns[" + i + "]: " + returns[i].length);
        }

        // Ensure all returns arrays have the same length
        int minLength = Arrays.stream(returns).mapToInt(r -> r.length).min().orElseThrow(() -> new RuntimeException("No returns data available"));
        for (int i = 0; i < n; i++) {
            if (returns[i].length != minLength) {
                returns[i] = Arrays.copyOf(returns[i], minLength);
            }
        }

        // Calcul des rendements moyens
        double[] meanReturns = Arrays.stream(returns)
                .mapToDouble(r -> new Mean().evaluate(r)).toArray();

        // Calcul de la matrice de covariance
        RealMatrix covarianceMatrix = new Covariance(returns).getCovarianceMatrix();
        for (int i = 0; i < covarianceMatrix.getRowDimension(); i++) {
            covarianceMatrix.addToEntry(i, i, 1e-10); // Add a small value to the diagonal
        }

        // Debugging: Print mean returns and covariance matrix
        System.out.println("Mean Returns: " + Arrays.toString(meanReturns));
        System.out.println("Covariance Matrix: " + covarianceMatrix);

        // Optimisation avec CMA-ES
        CMAESOptimizer optimizer = new CMAESOptimizer(
                10000, 1e-9, true, 10, 0, new MersenneTwister(), false, null
        );

        ObjectiveFunction objectiveFunction = new ObjectiveFunction(weights ->
                -computeSharpeRatio(weights, meanReturns, covarianceMatrix)
        );

        double[] lowerBound = new double[n];
        Arrays.fill(lowerBound, 0.01); // Set a small positive value
        double[] upperBound = new double[n];
        Arrays.fill(upperBound, 1.0); // Les poids doivent être entre 0 et 1

        SimpleBounds bounds = new SimpleBounds(lowerBound, upperBound);
        double[] initialGuessArray = new double[n];
        Arrays.fill(initialGuessArray, 0.1); // Set a small positive value for initial guess
        InitialGuess initialGuess = new InitialGuess(initialGuessArray);

        // Debugging: Print bounds and initial guess
        System.out.println("Lower Bound: " + Arrays.toString(lowerBound));
        System.out.println("Upper Bound: " + Arrays.toString(upperBound));
        System.out.println("Initial Guess: " + Arrays.toString(initialGuessArray));

        PointValuePair result = optimizer.optimize(
                new MaxEval(10000),
                objectiveFunction,
                GoalType.MAXIMIZE,
                bounds,
                initialGuess
        );

        return result.getPoint();
    }

    private double[] fetchHistoricalReturns(String coinId) {
        try {
            double[] prices = fetchHistoricalPrices(coinId);
            if (prices.length < 2) throw new RuntimeException("Pas assez de données pour calculer les rendements");

            double[] returns = new double[prices.length - 1];
            for (int i = 1; i < prices.length; i++) {
                returns[i - 1] = Math.log(prices[i] / prices[i - 1]);
            }
            return returns;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la récupération des rendements historiques", e);
        }
    }

    private double computeSharpeRatio(double[] weights, double[] returns, RealMatrix covMatrix) {
        double portfolioReturn = 0;
        for (int i = 0; i < weights.length; i++) {
            portfolioReturn += weights[i] * returns[i];
        }

        RealVector w = new ArrayRealVector(weights);
        double variance = w.dotProduct(covMatrix.operate(w));
        if (variance < 0) throw new RuntimeException("Variance négative détectée, problème dans la matrice de covariance.");

        double portfolioRisk = Math.sqrt(variance);
        return portfolioReturn / portfolioRisk;
    }
}