package com.example.ibudgetproject.entities.Transactions;

import com.example.ibudgetproject.entities.User.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@Setter
@AllArgsConstructor
public class SimCardAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long simCardId;

    @Column(nullable = false)
    private double balance = 0.0;

    @Column(nullable = false)
    private String currency = "TND";

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "simCardAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("simCardAccountTransactions")
    private List<SimTransactions> transactions;

    @OneToMany(mappedBy = "simCardAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RechargeCard> rechargeCards;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }





    public SimCardAccount() {
    }
    public SimCardAccount(long simCardId) {
        this.simCardId = simCardId;
    }
    public long getSimCardId() {
        return simCardId;
    }

    public void setSimCardId(long simCardId) {
        this.simCardId = simCardId;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<SimTransactions> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<SimTransactions> transactions) {
        this.transactions = transactions;
    }

    public List<RechargeCard> getRechargeCards() {
        return rechargeCards;
    }

    public void setRechargeCards(List<RechargeCard> rechargeCards) {
        this.rechargeCards = rechargeCards;
    }
}

