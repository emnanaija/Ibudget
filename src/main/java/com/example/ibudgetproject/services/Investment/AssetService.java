package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.*;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface AssetService {

    Asset createAsset(User user, Coin coin, double quantity);

    Asset getAssetById(Long assetId) throws Exception;

    Asset getAssetByUserIdAndId(Long userId, Long assetId);

    List<Asset> getUsersAssets(Long userId);

    Asset updateAsset(Long assetId, double quantity) throws Exception;
    Asset findAssetByUserIdAndCoinId(Long user_Id, String coinId);

    void deleteAsset(Long assetId);
    double calculateRiskMonteCarlo(Long userId, int days);
    public double calculateAssetValue(Long assetId) throws Exception;
    public double computeLogReturn(double[] historicalPrices);
    public ResponseEntity<Map<String, Object>> optimizePortfolioMarkowitz(Long userId);
    public Map<String, Double> calculatePortfolioPerformance(Long userId, int days);

}
