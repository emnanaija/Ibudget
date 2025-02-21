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
    private String billType;
    private double amount;
    private LocalDate dueDate;
    private String status = "PENDING"; //par defaut pending ttbdal payed ki ykhales


    //relations
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<Payment> payments;
}
