package com.example.ibudgetproject.entities.Investment;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CoinDTO {


    private String id;

    private String symbol;


    private String name;


    private String image;


    private double currentPrice;


    private double marketCap;
    private double marketCapRank;


    private long fullyDilutedValuation;


    private double totalVolume;
    private double high24h;


    private double low24h;


    private double priceChange24h;


    private double priceChangePercentage24h;


    private double marketCapChange24h;

    private double marketCapChangePercentage24h;


    private double circulatingSupply;


    private double totalSupply;


    private long maxSupply;


    private long ath;
    private double athChangePercentage;
    private LocalDateTime athDate;

    private double atl;

    private double atlChangePercentage;
    private LocalDateTime atlDate;
    private String roi;

    private LocalDateTime lastUpdated;

}

