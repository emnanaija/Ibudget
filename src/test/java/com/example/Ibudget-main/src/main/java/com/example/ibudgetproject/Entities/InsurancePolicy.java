package com.example.ibudgetproject.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Getter
@Entity

@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InsurancePolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
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
    @Enumerated(EnumType.STRING)
    private PaymentFrequency frequency;
    @JsonProperty("guarantor_cin")
    private String guarantor_cin;
    public enum InsuranceType {
        CAR,
        HOME,
        HEALTH
    }

    public enum PaymentFrequency {
        ANNUAL,
        SEMIANNUAL,
        QUARTERLY,
        MONTHLY,
        WEEKLY,
        ONCE
    }
    @PrePersist
    public void initializeFields() {
        this.subscription_date = LocalDateTime.now();
        this.expiration_date = subscription_date.plus(1, ChronoUnit.YEARS);
        this.status = "ACTIVE";
    }


    // Méthode toString pour afficher les détails de la police
    @Override
    public String toString() {
        return "InsurancePolicy{" +
                "insurance_policy_id=" + id +
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
    @JsonIgnore
    private List<Claim> claims;

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne(optional = true)
   @JsonIgnore
    @JoinColumn(name = "id_user", nullable = false)

    private User user ;

    public int getInsurance_policy_id() {
        return id;
    }

    public void setInsurance_policy_id(int id) {
        this.id = id;
    }

    public int getPolicy_number() {
        return policy_number;
    }

    public void setPolicy_number(int policy_number) {
        this.policy_number = policy_number;
    }

    public InsuranceType getInsurance_type() {
        return insurance_type;
    }

    public void setInsurance_type(InsuranceType insurance_type) {
        this.insurance_type = insurance_type;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public double getPremium() {
        return premium;
    }

    public void setPremium(double premium) {
        this.premium = premium;
    }

    public LocalDateTime getSubscription_date() {
        return subscription_date;
    }

    public void setSubscription_date(LocalDateTime subscription_date) {
        this.subscription_date = subscription_date;
    }

    public LocalDateTime getExpiration_date() {
        return expiration_date;
    }

    public void setExpiration_date(LocalDateTime expiration_date) {
        this.expiration_date = expiration_date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public float getDeductible() {
        return deductible;
    }

    public void setDeductible(float deductible) {
        this.deductible = deductible;
    }


    public int getId() {
        return id;
    }

    public PaymentFrequency getFrequency() {
        return frequency;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setFrequency(PaymentFrequency frequency) {
        this.frequency = frequency;
    }

    public String getGuarantor_cin() {
        return guarantor_cin;
    }

    public void setGuarantor_cin(String guarantor_cin) {
        this.guarantor_cin = guarantor_cin;
    }

    public List<Claim> getClaims() {
        return claims;
    }

    public void setClaims(List<Claim> claims) {
        this.claims = claims;
    }

    public User getUser() {
        return user;
    }
}


