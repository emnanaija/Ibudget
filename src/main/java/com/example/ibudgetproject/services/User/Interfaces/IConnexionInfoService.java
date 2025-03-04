package com.example.ibudgetproject.services.User.Interfaces;

import com.example.ibudgetproject.DTO.User.DeviceResponse;
import com.example.ibudgetproject.DTO.User.GeolocationResponse;
import com.example.ibudgetproject.entities.User.ConnexionInformation;
import com.example.ibudgetproject.entities.User.User;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface IConnexionInfoService {
    ConnexionInformation add(User user , HttpServletRequest request, String method);
    List<ConnexionInformation> getAllCnxInfo(User user);
    ConnexionInformation getCnxInfoById(Long id);
    void deleteCnxInfoById(Long id) throws Exception;
    void update(Long id, Boolean value,User user) throws Exception;
    GeolocationResponse getGeoInfo(HttpServletRequest request);
    DeviceResponse getDeviceInfo(HttpServletRequest request);
    boolean verifyConnectionInfo(User user, HttpServletRequest request) throws Exception;
    void sendLogInAlertEmail(String email,ConnexionInformation cnxInfo) throws Exception;
    void validateConnexionInfo(String token) throws Exception;

}
