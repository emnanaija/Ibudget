package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Asset;
import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.User.User;

import java.util.List;

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
    double[] optimizePortfolioMarkowitz(Long userId);

}
