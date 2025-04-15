package com.example.ibudgetproject.entities.expenses;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ExpenseCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    private String description; // Description facultative de la catégorie

    @Column(name = "budget_alloué") // Nom dans la base
    private double budgetAlloue;    // Nom dans l'entité Java

    @Column(name = "montantDepensé", nullable = false)
    private double montantDepense = 0.0;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore

    private List<Depense> depenses;
    public double getSoldeRestant() {
        return budgetAlloue - montantDepense;
    }
    @Override
    public String toString() {
        return this.nom;  // Retourne le nom ou un autre attribut pertinent de la catégorie
    }

}

