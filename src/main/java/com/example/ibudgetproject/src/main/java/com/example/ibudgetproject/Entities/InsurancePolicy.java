package com.example.ibudgetproject.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsurancePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int insurance_policy_id;
    @JsonProperty("policy_number")
    private int policy_number;
    @Enumerated(EnumType.STRING)
    @JsonProperty("insurance_type")
    private InsuranceType insurance_type;
    @JsonProperty("details")
    private String details;
    @JsonProperty("premium")
    private double premium;
    @JsonProperty("subscription_date")
    private LocalDateTime subscription_date;
    @JsonProperty("expiration_date")
    private LocalDateTime expiration_date;
    @JsonProperty("status")
    private String status;
    @JsonProperty("deductible")
    private float deductible;
    @JsonProperty("frequency")
    private String frequency;
    @JsonProperty("guarantor_cin")
    private String guarantor_cin;
    public enum InsuranceType {
        CAR,
        HOME,
        HEALTH
    }
@PrePersist
public void initializeFields(){
    this.subscription_date = LocalDateTime.now();
    this.expiration_date = subscription_date.plus(1, ChronoUnit.YEARS);

}
    public int getInsurance_policy_id() {
        return insurance_policy_id;
    }


    // Méthode toString pour afficher les détails de la police
    @Override
    public String toString() {
        return "InsurancePolicy{" +
                "insurance_policy_id=" + insurance_policy_id +
                ", policy_number=" + policy_number +
                ", insurance_type='" + insurance_type + '\'' +
                ", premium=" + premium +
                ", subscription_date=" + subscription_date +
                ", expiration_date=" + expiration_date +
                ", status='" + status + '\'' +
                ", deductible=" + deductible +
                ", frequency='" + frequency + '\'' +
                ", guarantor_cin='" + guarantor_cin + '\'' +
                '}';
    }

    @OneToMany(mappedBy = "insurancePolicy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Claim> claims;

    public User getUser() {
        return user;
    }

    public int getPolicy_number() {
        return policy_number;
    }

    public InsuranceType getInsurance_type() {
        return insurance_type;
    }

    public String getDetails() {
        return details;
    }

    public double getPremium() {
        return premium;
    }

    public LocalDateTime getSubscription_date() {
        return subscription_date;
    }

    public LocalDateTime getExpiration_date() {
        return expiration_date;
    }

    public String getStatus() {
        return status;
    }

    public float getDeductible() {
        return deductible;
    }

    public String getFrequency() {
        return frequency;
    }

    public String getGuarantor_cin() {
        return guarantor_cin;
    }

    public List<Claim> getClaims() {
        return claims;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne(optional = true)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user ;


}


