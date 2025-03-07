package com.example.ibudgetproject.controllers.Investment;


import com.example.ibudgetproject.entities.Investment.Asset;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.Investment.AssetService;
import com.example.ibudgetproject.services.User.UserService;
import jdk.jshell.spi.ExecutionControl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/asset")
public class AssetController {
    @Autowired
    private AssetService assetService;
    @Autowired
    private UserService userService;

    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long assetId) throws Exception {
        Asset asset = assetService.getAssetById(assetId);
        return ResponseEntity.ok().body(asset);
    }

    @GetMapping("/coin/{coinId}/user")
    public ResponseEntity<Asset> getAssetByUserIdAndCoinId(@PathVariable String coinId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Asset asset = assetService.findAssetByUserIdAndCoinId(user.getUserId(), coinId);
        return ResponseEntity.ok().body(asset);

    }

    @GetMapping()
    public ResponseEntity<List<Asset>> getAssetsForUser(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Asset> assets = assetService.getUsersAssets(user.getUserId());
        return ResponseEntity.ok().body(assets);
    }
    @GetMapping("/risk")
    public ResponseEntity<Double> getMonteCarloRisk(@RequestHeader("Authorization") String jwt, @RequestParam int days) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        double risk = assetService.calculateRiskMonteCarlo(user.getUserId(), days);
        return ResponseEntity.ok().body(risk);
    }
    @GetMapping("/optimize")
    public ResponseEntity<Map<String, Object>> optimizePortfolio(@RequestHeader("Authorization") String jwt) {
        try {
            // Récupérer l'utilisateur à partir du JWT
            User user = userService.findUserProfileByJwt(jwt);

            // Appeler le service pour optimiser le portefeuille
            ResponseEntity<Map<String, Object>> response = assetService.optimizePortfolioMarkowitz(user.getUserId());

            // Retourner la réponse du service
            return response;
        } catch (Exception e) {
            // En cas d'erreur, retourner une réponse avec une erreur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de l'optimisation du portefeuille: " + e.getMessage()));
        }
    }
    @GetMapping("/performance")
    public ResponseEntity<Map<String, Double>> getPortfolioPerformance(@RequestHeader("Authorization") String jwt, @RequestParam int days) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Map<String, Double> performance = assetService.calculatePortfolioPerformance(user.getUserId(), days);
        return ResponseEntity.ok().body(performance);
    }

}



