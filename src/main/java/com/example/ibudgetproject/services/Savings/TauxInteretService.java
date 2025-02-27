package com.example.ibudgetproject.services.Savings;

import com.example.ibudgetproject.entities.Savings.TauxInteret;
import com.example.ibudgetproject.repositories.Savings.TauxInteretRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
public class TauxInteretService {

    @Autowired
    private TauxInteretRepository tauxInteretRepository;


    public TauxInteret creerTauxInteret(BigDecimal taux, String description) {
        TauxInteret tauxInteret = new TauxInteret();
        tauxInteret.setTaux(taux);
        tauxInteret.setDescription(description);
        return tauxInteretRepository.save(tauxInteret);
    }
    public TauxInteret mettreAJourTauxInteret(Long id, BigDecimal taux, String description) {
        TauxInteret tauxInteret = tauxInteretRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Taux d'intérêt non trouvé"));
        tauxInteret.setTaux(taux);
        tauxInteret.setDescription(description);
        return tauxInteretRepository.save(tauxInteret);
    }
    public void supprimerTauxInteret(Long id) {
        tauxInteretRepository.deleteById(id);
    }
    public List<TauxInteret> getAllTauxInteret() {
        return tauxInteretRepository.findAll();
    }
}