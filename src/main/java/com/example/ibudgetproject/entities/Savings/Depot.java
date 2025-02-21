package com.example.ibudgetproject.entities.Savings;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal montant;
    private Date dateDepot;
    private String frequenceDepot;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date prochainDepot;
    @ManyToOne
    @JoinColumn(name = "compte_epargne_id", nullable = false) // Clé étrangère vers CompteEpargne
    private CompteEpargne compteEpargne;



    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getMontant() {
        return montant;
    }

    public void setMontant(BigDecimal montant) {
        this.montant = montant;
    }

    public Date getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(Date dateDepot) {
        this.dateDepot = dateDepot;
    }

    public String getFrequenceDepot() {
        return frequenceDepot;
    }

    public void setFrequenceDepot(String frequenceDepot) {
        this.frequenceDepot = frequenceDepot;
    }
    public Date getprochainDepot() {
        return prochainDepot;
    }

    public void setprochainDepot(Date prochainDepot) {
        this.prochainDepot = prochainDepot;
    }
    public CompteEpargne getCompteEpargne() {
        return compteEpargne;
    }

    public void setCompteEpargne(CompteEpargne compteEpargne) {
        this.compteEpargne = compteEpargne;
    }

   
}

