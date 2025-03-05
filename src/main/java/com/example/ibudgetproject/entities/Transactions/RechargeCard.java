package com.example.ibudgetproject.entities.Transactions;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RechargeCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;
    @Column(nullable = false)
    private double amount;

    @Column(nullable = false)
    private boolean used = false;

    //getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public boolean isUsed() {
        return used;
    }

    public void setUsed(boolean used) {
        this.used = used;
    }

    public SimCardAccount getSimCardAccount() {
        return simCardAccount;
    }

    public void setSimCardAccount(SimCardAccount simCardAccount) {
        this.simCardAccount = simCardAccount;
    }


    //relations


    @ManyToOne
    @JoinColumn(name = "sim_card_id")
    @JsonBackReference("simCardAccountRechargeCards") // Add this line
    private SimCardAccount simCardAccount;
}
