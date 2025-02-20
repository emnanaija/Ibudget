package com.example.ibudgetproject.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idPayment;
    @Column(nullable = false)
    private Double amountPaid;
    @Column(nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();
    @Column(nullable = false)
    private String paymentMethod; // SIM_CARD, WALLET (ken khdmtou web3) tabka ken sim_card meth w ttrbat bl wallet mt3 l coin
    @Column(nullable = false)
    private Boolean paymentStatus = false; //false = pending or waiting , true = khaless
    private String beneficiary;
    private String comment;
    private LocalDateTime validationDate;

    //Getters and setters


    public long getIdPayment() {
        return idPayment;
    }

    public void setIdPayment(long idPayment) {
        this.idPayment = idPayment;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Boolean getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(Boolean paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBeneficiary() {
        return beneficiary;
    }

    public void setBeneficiary(String beneficiary) {
        this.beneficiary = beneficiary;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getValidationDate() {
        return validationDate;
    }

    public void setValidationDate(LocalDateTime validationDate) {
        this.validationDate = validationDate;
    }

    public SimCardTransactions getTransaction() {
        return transaction;
    }

    public void setTransaction(SimCardTransactions transaction) {
        this.transaction = transaction;
    }

    public Bill getBill() {
        return bill;
    }

    public void setBill(Bill bill) {
        this.bill = bill;
    }

    //relations
    @OneToOne
    @JoinColumn(name = "transaction_id", nullable = false)
    private SimCardTransactions transaction;

    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = true)
    private Bill bill;



}
