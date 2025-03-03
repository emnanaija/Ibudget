package com.example.ibudgetproject.entities.Transactions;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idBill;

    private String billType; // e.g., Electricity, Water, Rent
    private double amount;
    private LocalDate dueDate;
    private String status = "PENDING"; // PENDING or PAID
    private boolean isRecurring = false; // Recurring bill flag
    private LocalDate nextDueDate; // For recurring bills
    private String beneficiary; // Add this field

    public String getBeneficiary() {
        return beneficiary;
    }

    public void setBeneficiary(String beneficiary) {
        this.beneficiary = beneficiary;
    }

    // Relations
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Payment> payments;


    // Getters and setters

    public long getIdBill() {
        return idBill;
    }

    public void setIdBill(long idBill) {
        this.idBill = idBill;
    }

    public String getBillType() {
        return billType;
    }

    public void setBillType(String billType) {
        this.billType = billType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public LocalDate getNextDueDate() {
        return nextDueDate;
    }

    public void setNextDueDate(LocalDate nextDueDate) {
        this.nextDueDate = nextDueDate;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}
