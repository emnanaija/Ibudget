package com.example.ibudgetproject.services.User;

import com.example.ibudgetproject.configurations.EmailTemplateName;
import com.example.ibudgetproject.DTO.User.DeviceResponse;
import com.example.ibudgetproject.DTO.User.GeolocationResponse;
import com.example.ibudgetproject.entities.User.ConnexionInformation;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.User.ConnexionInfoRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.example.ibudgetproject.services.User.Interfaces.IConnexionInfoService;
import com.example.ibudgetproject.utilities.EncryptionUtility;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConnexionInfoService implements IConnexionInfoService {
    private static final long tokenExpirationInMinutes = 5;
    @Autowired
    private ConnexionInfoRepository connexionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;


    @Value("${geo.location.api.key}")
    private String geoLocationApiKey;
    @Autowired
    private  RestTemplate restTemplate = new RestTemplate();

    private EncryptionUtility encryptor = new EncryptionUtility();
//***** add connexion info
    @Override
    public ConnexionInformation add(User user , HttpServletRequest request, String method)
    {
        GeolocationResponse geoData=getGeoInfo(request);
        DeviceResponse deviceData=getDeviceInfo(request);
        var connexionInfo=ConnexionInformation.builder()
                .ipAdress(geoData.getIpAddress())
                .country(geoData.getCountry())
                .region(geoData.getRegion())
                .city(geoData.getCity())
                .longitude(geoData.getLongitude())
                .latitude(geoData.getLatitude())
                .timeZone(geoData.getTimezone())
                .internetProvider(geoData.getInternetProvider())
                .isVpn(geoData.getPrivacy().getVpn())
                .deviceBrand(deviceData.getDeviceBrand())
                .deviceName(deviceData.getDeviceName())
                .deviceType(deviceData.getDeviceType())
                .operatingSystemVersion(deviceData.getOperatingSystemVersion())
                .operatingSystemName(deviceData.getOperatingSystemName())
                .user(user)
                .build();
        if(method.equals("register"))
        {
            connexionInfo.setIsApproved(true);
        }else{
            connexionInfo.setIsApproved(false);
        }

        connexionRepository.save(connexionInfo);
        return   connexionInfo;
    }
    //*****Get all devices by user
    @Override
    public List<ConnexionInformation> getAllCnxInfo(User user){
        List<ConnexionInformation> storedInfoList = connexionRepository.findByUser(user);
        return storedInfoList;
    }


    @Override
    public ConnexionInformation getCnxInfoById(Long id,User user) throws Exception {
        Optional<ConnexionInformation> optionalConnexionInfo = connexionRepository.findById(id);
        if (optionalConnexionInfo.isPresent()) {
            ConnexionInformation connexionInfo= optionalConnexionInfo.get();
            if (connexionInfo.getUser().getUserId().equals(user.getUserId())) {
                return connexionInfo;
            } else {
                throw new Exception("Wrong Id");
            }
        } else {
            throw new Exception("Id doesn't exist");
        }

    }
    //***Delete a connexion info
    @Override
    public void deleteCnxInfoById(Long id,User user) throws Exception {
        Optional<ConnexionInformation> optionalConnexionInfo = connexionRepository.findById(id);
        if (optionalConnexionInfo.isPresent()) {
            ConnexionInformation connexionInfo= optionalConnexionInfo.get();
            if (connexionInfo.getUser().getUserId().equals(user.getUserId())) {
                connexionRepository.deleteById(id);
            } else {
                throw new Exception("Wrong id");
            }
        } else {
            throw new Exception("Id doesn't exist");
        }
    }
    //***update a connexion info
    @Override
    public void updateApproval(Long id, Boolean value,User user) throws Exception {
        if (connexionRepository.existsById(id)) {
            Optional<ConnexionInformation> optcnxInfo = connexionRepository.findById(id);
            List<ConnexionInformation> storedInfoList = connexionRepository.findByUser(user);
            if (optcnxInfo.isPresent()) {
                ConnexionInformation cnxInfo = optcnxInfo.get();
                String deviceName = cnxInfo.getDeviceName();
                for (ConnexionInformation storedInfo : storedInfoList) {
                    if (storedInfo.getDeviceName().equals(deviceName)) {
                        cnxInfo.setIsApproved(value);
                        connexionRepository.save(cnxInfo);
                    }
                }
            } else {
                throw new Exception("Id doesn't exist");
            }
        }
    }


    //***********Get the geolocationInfo
    @Override
    public GeolocationResponse getGeoInfo(HttpServletRequest request)
    {
        if (request == null) {
            throw new IllegalArgumentException("HttpServletRequest cannot be null.");
        }

        String userIpAddress="102.159.243.54";
        if (userIpAddress == null || userIpAddress.isEmpty()) {
            throw new RuntimeException("Unable to retrieve user IP address.");
        }

        String geoApiUrl = "https://ipinfo.io/" + userIpAddress + "/json?token=" + geoLocationApiKey;

        GeolocationResponse geoData = restTemplate.getForObject(geoApiUrl, GeolocationResponse.class);
        if (geoData == null) {
            throw new RuntimeException("Failed to retrieve geolocation data.");
        }
        if (geoData.getPrivacy() == null) {
            geoData.setPrivacy(new GeolocationResponse.Privacy());  // Initialize privacy if null
        }

        if (geoData.getPrivacy().getVpn() == null) {
            geoData.getPrivacy().setVpn(false);  // Set default value for vpn if null
        }
        return geoData;
    }

    //*********get the device info
    @Override
    public DeviceResponse getDeviceInfo(HttpServletRequest request)
    {
        String userAgentString = request.getHeader("User-Agent");

        if (userAgentString == null || userAgentString.isEmpty()) {
            throw new RuntimeException("User-Agent header is missing or empty.");
        }

        UserAgentAnalyzer analyzer = UserAgentAnalyzer.newBuilder()
                .withCache(10000)
                .withField("DeviceBrand")
                .withField("OperatingSystemName")
                .withField("DeviceName")
                .withField("DeviceClass")
                .withField("OperatingSystemVersion")
                .build();
        UserAgent userAgent = analyzer.parse(userAgentString);
        DeviceResponse deviceResponse=DeviceResponse.builder()
                .deviceBrand(userAgent.getValue("DeviceBrand"))
                .deviceName(userAgent.getValue("DeviceName"))
                .deviceType(userAgent.getValue("DeviceClass"))
                .operatingSystemVersion(userAgent.getValue("OperatingSystemVersion"))
                .operatingSystemName(userAgent.getValue("OperatingSystemName"))
                .build();
        return  deviceResponse;
    }


    //******Verify connexion info
    @Override
    public boolean verifyConnectionInfo(User user, HttpServletRequest request) throws Exception {
        List<ConnexionInformation> storedInfoList = connexionRepository.findByUser(user);

        if (storedInfoList.isEmpty()) {
            return false;
        }

        GeolocationResponse geoData=getGeoInfo(request);
        DeviceResponse deviceData=getDeviceInfo(request);

        if (geoData== null || deviceData == null) {
            return false;
        }
        String userIpAddress="102.159.243.54";

        for (ConnexionInformation storedInfo : storedInfoList) {
            if (storedInfo.getIpAdress().equals(userIpAddress) &&
                    storedInfo.getDeviceBrand().equals(deviceData.getDeviceBrand()) &&
                    storedInfo.getDeviceName().equals(deviceData.getDeviceName()) &&
                    storedInfo.getDeviceType().equals(deviceData.getDeviceType()) &&
                    storedInfo.getOperatingSystemName().equals(deviceData.getOperatingSystemName()) &&
                    storedInfo.getOperatingSystemVersion().equals(deviceData.getOperatingSystemVersion())) {
                if (!storedInfo.getIsApproved())
                    return false;
                return true;
            }
        }

        return false;
    }

    //*******Email Alert : login Attempt
    @Override
    public void sendLogInAlertEmail(String email,ConnexionInformation cnxInfo) throws Exception {

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOptional.get();


        long timestamp = Instant.now().getEpochSecond();
        String tokenData = email+":"+cnxInfo.getDeviceName() + ":" + timestamp;


        // Encrypt the token
        String encryptedToken = encryptor.encrypt(tokenData);

        String approvalLink = "http://localhost:8080/users/approve-login?token=" + encryptedToken;

        String mapUrl = "https://www.latlong.net/c/?lat="
                + cnxInfo.getLatitude() + "&long=" + cnxInfo.getLongitude() ;


        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.LOGIN_ALERT,
                approvalLink,
                cnxInfo,
                mapUrl,
                "Log in Alert"
        );

    }

    //*******Validate the device via the email link
    @Override
    public void validateConnexionInfo(String token) throws Exception {
        String decryptedData = encryptor.decrypt(token);
        String[] parts = decryptedData.split(":");
        if (parts.length != 3) {
            throw new Exception("Invalid token format");
        }

        String email = parts[0];
        String deviceName = parts[1];
        long timestamp = Long.parseLong(parts[2]);


        long currentTime = Instant.now().getEpochSecond();
        long timeDifference = Duration.between(Instant.ofEpochSecond(timestamp), Instant.ofEpochSecond(currentTime)).toMinutes();

        if (timeDifference > tokenExpirationInMinutes) {
            throw new Exception("Token expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("User not found"));
        List<ConnexionInformation> storedInfoList = connexionRepository.findByUser(user);
        for (ConnexionInformation storedInfo : storedInfoList) {
            if (storedInfo.getDeviceName().equals(deviceName)){
                storedInfo.setIsApproved(true);
                connexionRepository.save(storedInfo);
            }
        }
    }

}
