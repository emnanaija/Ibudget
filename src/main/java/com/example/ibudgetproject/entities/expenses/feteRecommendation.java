package com.example.ibudgetproject.entities.expenses;

public class feteRecommendation {
    private String fete;
    private String budget;
    private String cadeaux;

    // Constructeurs, getters et setters
    public feteRecommendation(String fete, String budget, String cadeaux) {
        this.fete = fete;
        this.budget = budget;
        this.cadeaux = cadeaux;
    }

    public String getFete() {
        return fete;
    }

    public void setFete(String fete) {
        this.fete = fete;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getCadeaux() {
        return cadeaux;
    }

    public void setCadeaux(String cadeaux) {
        this.cadeaux = cadeaux;
    }
}
