package com.example.ibudgetproject.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Compensation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @JsonProperty("amount_paid")
    private double amount_paid;
    @JsonProperty("payment_date")
    private LocalDateTime payment_date;
    @JsonProperty("payment_method")
    private String payment_method;

    @JsonProperty("payment_status")
    private boolean payment_status;
    @JsonProperty("beneficiary")
    private String beneficiary;
    @JsonProperty("comment")
    private String comment;
    @JsonProperty("validation_date")
    private LocalDateTime validation_date;

    @OneToMany(mappedBy = "compensation", cascade = CascadeType.ALL)
    private List<Claim> coveredClaims;

    public int getId() {
        return id;
    }

    public double getAmount_paid() {
        return amount_paid;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setAmount_paid(double amount_paid) {
        this.amount_paid = amount_paid;
    }

    public void setPayment_date(LocalDateTime payment_date) {
        this.payment_date = payment_date;
    }

    public void setPayment_method(String payment_method) {
        this.payment_method = payment_method;
    }

    public void setPayment_status(boolean payment_status) {
        this.payment_status = payment_status;
    }

    public void setBeneficiary(String beneficiary) {
        this.beneficiary = beneficiary;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setValidation_date(LocalDateTime validation_date) {
        this.validation_date = validation_date;
    }

    public void setCoveredClaims(List<Claim> coveredClaims) {
        this.coveredClaims = coveredClaims;
    }
}
