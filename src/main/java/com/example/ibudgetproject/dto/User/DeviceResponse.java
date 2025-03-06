package com.example.ibudgetproject.dto.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DeviceResponse {
    private String operatingSystemName;
    private String deviceName;
    private String deviceType;

    private String operatingSystemVersion;
    private String deviceBrand;
}
