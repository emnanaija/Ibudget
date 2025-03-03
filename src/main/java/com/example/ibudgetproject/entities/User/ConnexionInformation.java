package com.example.ibudgetproject.entities.User;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ConnexionInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String country;
    private String city;
    private String region;
    private double latitude ;
    private double longitude ;
    private String internetProvider;
    private String timeZone;
    private String ipAdress;
    private Boolean isVpn;

    private String deviceBrand;
    private String deviceName;
    private String deviceType;
    private String operatingSystemVersion;
    private String operatingSystemName;


    private Boolean isApproved ;

    @CreatedDate
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_FK")
    @JsonIgnore
    private User user;
}
