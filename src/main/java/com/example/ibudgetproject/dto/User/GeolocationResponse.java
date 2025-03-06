package com.example.ibudgetproject.dto.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeolocationResponse {

    @JsonProperty("ip")
    private String ipAddress;

    private String city;
    private String region;
    private String country;
    private String timezone;

    @JsonProperty("loc")
    private String location;
    private double latitude;
    private double longitude;

    public void setLocation(String location) throws Exception {
        this.location = location;
        if (location != null && !location.isEmpty()) {
            String[] latLong = location.split(",");
            if (latLong.length == 2) {
                try {
                    this.latitude = Double.parseDouble(latLong[0]);
                    this.longitude = Double.parseDouble(latLong[1]);
                } catch(Exception e) {
                    throw new Exception("Couldn't retrieve the longitude or latitude");
                }
            }
        }
    }


    @Data
    public static class  Privacy {
        private boolean vpn;
    }
    private Privacy privacy;
    @Data
    public static class ASN {
        @JsonProperty("name")
        private String internetProvider;
    }
    private ASN asn ;

}
