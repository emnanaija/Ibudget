package com.example.ibudgetproject.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Claim {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;
     @JsonProperty("claim_name")
     private String claim_name;
     @JsonProperty("claim_location")
     private String claim_location;
     @JsonProperty("description")
     private String description;
     @JsonProperty("claim_date")
     private LocalDateTime claim_date;
     @JsonProperty("claimed_amount")
     private double claimed_amount;
     @JsonProperty("claim_status")
     private boolean claim_status;
     @JsonProperty("expert_report")
     private String expert_report;


    @ManyToOne(optional = true)
    @JoinColumn(name = "insurance_policy_id")
    private InsurancePolicy insurancePolicy;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;


    @ManyToOne
    @JoinColumn(name = "compensation_id")
    private Compensation compensation; // La compensation qui a pris en charge ce sinistre


    public int getId() {
        return id;
    }

    public double getClaimed_amount() {
        return claimed_amount;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isClaim_status() {
        return claim_status;
    }

    public void setClaim_name(String claim_name) {
        this.claim_name = claim_name;
    }

    public void setClaim_location(String claim_location) {
        this.claim_location = claim_location;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setClaim_date(LocalDateTime claim_date) {
        this.claim_date = claim_date;
    }

    public void setClaimed_amount(double claimed_amount) {
        this.claimed_amount = claimed_amount;
    }

    public void setClaim_status(boolean claim_status) {
        this.claim_status = claim_status;
    }

    public void setExpert_report(String expert_report) {
        this.expert_report = expert_report;
    }

    public void setInsurancePolicy(InsurancePolicy insurancePolicy) {
        this.insurancePolicy = insurancePolicy;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public void setCompensation(Compensation compensation) {
        this.compensation = compensation;
    }

}
