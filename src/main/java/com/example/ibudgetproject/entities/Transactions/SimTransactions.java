package com.example.ibudgetproject.entities.Transactions;

import com.example.ibudgetproject.entities.User.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Table(name = "sim_transactions")
public class SimTransactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idTransaction;

    private double amount;

    @Enumerated(EnumType.ORDINAL)
    private TransactionType transactionType;

    private String status;
    private String refNum;
    @Column(name = "descreption")
    private String descreption;
    private LocalDateTime transactionDate = LocalDateTime.now();

    @Getter
    @ManyToOne
    @JoinColumn(name = "sim_card_id", nullable = false)
    @JsonBackReference("simCardAccountTransactions")
    private SimCardAccount simCardAccount;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonBackReference("userSentTransactions")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    @JsonBackReference("userReceivedTransactions")
    private User receiver;

    @OneToOne(mappedBy = "transaction", cascade = CascadeType.ALL)
    private Payment payment;

    public long getIdTransaction() {
        return idTransaction;
    }

    public void setIdTransaction(long idTransaction) {
        this.idTransaction = idTransaction;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRefNum() {
        return refNum;
    }

    public void setRefNum(String refNum) {
        this.refNum = refNum;
    }

    public String getDesc() {
        return descreption;
    }

    public void setDesc(String descreption) {
        this.descreption = descreption;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDateTime transactionDate) {
        this.transactionDate = transactionDate;
    }

    public void setSimCardAccount(SimCardAccount simCardAccount) {
        this.simCardAccount = simCardAccount;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public User getReceiver() {
        return receiver;
    }

    public void setReceiver(User receiver) {
        this.receiver = receiver;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public String getDescreption() {
        return descreption;
    }

    public void setDescreption(String descreption) {
        this.descreption = descreption;
    }

    public SimCardAccount getSimCardAccount() {
        return simCardAccount;
    }

//    CREATE TABLE sim_card_transactions (
//            id_transaction BIGINT AUTO_INCREMENT PRIMARY KEY,
//            amount DOUBLE NOT NULL,
//            transaction_type INT NOT NULL,
//            status VARCHAR(255),
//    ref_num VARCHAR(255),
//    description TEXT,
//    transaction_date DATETIME NOT NULL,
//    sim_card_id BIGINT NOT NULL,
//    sender_id INT NOT NULL,
//    receiver_id INT NOT NULL,
//    FOREIGN KEY (sim_card_id) REFERENCES sim_card_account(sim_card_id),
//    FOREIGN KEY (sender_id) REFERENCES _users(user_id),
//    FOREIGN KEY (receiver_id) REFERENCES _users(user_id)
//            );

}
