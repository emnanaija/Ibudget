package com.example.ibudget.Entity;

import jakarta.persistence.*;
import lombok.*;
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
    @GeneratedValue
    private Integer id;
    private String locationName ;
    private double locationLatitude ;
    private double locationLongitude ;
    private String deviceName ;
    private String deviceType;
    private boolean isApproved ;
    private LocalDateTime lastUsed;
}
