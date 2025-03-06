package com.example.ibudgetproject.DTO.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GeolocationResponse {

    @JsonProperty("ip")
    private String ipAddress;

    public String getIpAddress() {
        if (ipAddress==null)
            return "UNKOWN";
        return ipAddress;
    }

    private String city;

    public String getCity() {
        if (city==null)
            return "UNKOWN";
        return city;
    }

    private String region;

    public String getRegion() {
        if (region==null)
            return "UNKOWN";
        return region;
    }

    private String country;

    public String getCountry() {
        if (country==null)
            return "UNKOWN";
        return country;
    }

    private String timezone;

    public String getTimezone() {
        if (timezone==null)
            return "UNKOWN";
        return timezone;
    }

    @JsonProperty("loc")
    private String location;
    private double latitude;
    private double longitude;

    public void setLocation(String location) throws Exception {
        if (location==null)
        {
            this.latitude = 0.0;
            this.longitude =0.0;
        }
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
        private Boolean vpn;
    }
    private Privacy privacy;

    @JsonProperty("org")
    private String internetProvider;

    public String getInternetProvider() {
        if (internetProvider==null)
            return "UNKOWN";
        return internetProvider;
    }
}
