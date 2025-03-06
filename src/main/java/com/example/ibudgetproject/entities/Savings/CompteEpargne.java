package com.example.ibudgetproject.entities.Savings;
import com.example.ibudgetproject.entities.User.User;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
public class CompteEpargne {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal solde;
    @ManyToOne
    @JoinColumn(name = "taux_interet_id")
    private TauxInteret tauxInteret;
    @OneToMany(mappedBy = "compteEpargne", cascade = CascadeType.ALL)
    private List<Objectif> objectifs;
    @OneToMany(mappedBy = "compteEpargne", cascade = CascadeType.ALL)
    private List<Depot> depots;
    @OneToMany(mappedBy = "compteEpargne", cascade = CascadeType.ALL)
    private List<DepotLog> depotsSupprimes = new ArrayList<>();
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getSolde() {
        return solde;
    }

    public void setSolde(BigDecimal solde) {
        this.solde = solde;
    }
    public TauxInteret getTauxInteret() {
        return tauxInteret;
    }

    public void setTauxInteret(TauxInteret tauxInteret) {
        this.tauxInteret = tauxInteret;
    }
    public List<Objectif> getObjectifs() { return objectifs; }
    public void setObjectifs(List<Objectif> objectifs) { this.objectifs = objectifs; }
    public List<Depot> getDepots() {
        return depots;
    }

    public void setDepots(List<Depot> depots) {
        this.depots = depots;
    }
    public List<DepotLog> getDepotsSupprimes() {
        return depotsSupprimes;
    }

}

