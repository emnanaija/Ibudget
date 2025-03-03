package com.example.ibudgetproject.DTO.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnexionInfoResponse {
    private String country;
    private String city;
    private double locationLatitude ;
    private double locationLongitude ;
    private String ipAdress;

    private String brand;
    private String model;
    private String deviceType;

    private String osName;
    private String osVersion;
}
