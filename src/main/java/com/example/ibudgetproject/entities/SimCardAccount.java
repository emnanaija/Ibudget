package com.example.ibudgetproject.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SimCardAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long simCardId;
    @Column(nullable = false)
    private double balance = 0.0;
    @Column(nullable = false)
    private String currency = "TND";
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    //getters w setters lin nrigel l lombok
    public Long getSimCardId() {
        return simCardId;
    }
    public double getBalance() {
        return balance;
    }
    public void setBalance(double balance) {
        this.balance = balance;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public String getCurrency() {
        return currency;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    //relations
    @OneToMany(mappedBy = "simCardAccount", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<SimCardTransactions> transactions;


    @OneToMany(mappedBy = "simCardAccount", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RechargeCard> rechargeCards;

    @OneToOne
    @JoinColumn(name = "id_user")
    private User user;
}
