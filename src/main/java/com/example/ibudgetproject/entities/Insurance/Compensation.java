package com.example.ibudgetproject.entities.Insurance;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonProperty("beneficiaryid")
    private long beneficiaryid;
    @JsonProperty("comment")
    private String comment;


    @OneToMany(mappedBy = "compensation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Claim> coveredClaims;

    public List<Claim> getCoveredClaims() {
        return coveredClaims;
    }

    public void setBeneficiaryid(long beneficiaryid) {
        this.beneficiaryid = beneficiaryid;
    }

    public LocalDateTime getPayment_date() {
        return payment_date;
    }

    public String getPayment_method() {
        return payment_method;
    }

    public boolean isPayment_status() {
        return payment_status;
    }

    public long getBeneficiaryid() {
        return beneficiaryid;
    }

    public String getComment() {
        return comment;
    }

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



    public void setComment(String comment) {
        this.comment = comment;
    }



    public void setCoveredClaims(List<Claim> coveredClaims) {
        this.coveredClaims = coveredClaims;
    }
}
