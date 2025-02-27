package com.example.ibudgetproject.entities.Savings;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Getter
@Setter
public class DepotLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal montant;
    private String frequenceDepot;
    private Date dateDepot;
    private Date dateSuppression;
    @ManyToOne
    @JoinColumn(name = "compte_epargne_id", nullable = false)
    private CompteEpargne compteEpargne;

    public DepotLog() {}

    public DepotLog(CompteEpargne compteEpargne, BigDecimal montant, String frequenceDepot, Date dateDepot) {
        this.compteEpargne = compteEpargne;
        this.montant = montant;
        this.frequenceDepot = frequenceDepot;
        this.dateDepot = dateDepot;
        this.dateSuppression = new Date();
    }

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

    public String getFrequenceDepot() {
        return frequenceDepot;
    }

    public void setFrequenceDepot(String frequenceDepot) {
        this.frequenceDepot = frequenceDepot;
    }

    public Date getDateDepot() {
        return dateDepot;
    }

    public void setDateDepot(Date dateDepot) {
        this.dateDepot = dateDepot;
    }

    public Date getDateSuppression() {
        return dateSuppression;
    }

    public void setDateSuppression(Date dateSuppression) {
        this.dateSuppression = dateSuppression;
    }

    public CompteEpargne getCompteEpargne() {
        return compteEpargne;
    }

    public void setCompteEpargne(CompteEpargne compteEpargne) {
        this.compteEpargne = compteEpargne;
    }
}
