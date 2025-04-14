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

    @Column(nullable = false)
    private double budgetAlloué; // Budget alloué pour cette catégorie

    @Column(name = "montantDepensé", nullable = false)
    private double montantDepensé = 0.0;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore

    private List<Depense> depenses;
    public double getSoldeRestant() {
        return budgetAlloué - montantDepensé;
    }
    @Override
    public String toString() {
        return this.nom;  // Retourne le nom ou un autre attribut pertinent de la catégorie
    }

}

