package com.example.ibudgetproject.entities.Amine_Savings;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
public class Objectif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private BigDecimal montantObjectif;
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Date dateEstimee;

    @ManyToOne
    @JoinColumn(name = "compte_epargne_id")
    private CompteEpargne compteEpargne;



    @PrePersist
    protected void onCreate() {
        this.dateCreation = new Date();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public BigDecimal getMontantObjectif() {
        return montantObjectif;
    }

    public void setMontantObjectif(BigDecimal montantObjectif) {
        this.montantObjectif = montantObjectif;
    }

    public Date getDateEstimee() {
        return dateEstimee;
    }

    public void setDateEstimee(Date dateEstimee) {
        this.dateEstimee = dateEstimee;
    }

    public CompteEpargne getCompteEpargne() {
        return compteEpargne;
    }

    public void setCompteEpargne(CompteEpargne compteEpargne) {
        this.compteEpargne = compteEpargne;
    }

    public Date getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

}
