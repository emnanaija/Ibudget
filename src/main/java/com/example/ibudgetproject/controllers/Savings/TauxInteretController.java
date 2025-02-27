package com.example.ibudgetproject.controllers.Savings;

import com.example.ibudgetproject.entities.Savings.TauxInteret;
import com.example.ibudgetproject.services.Savings.TauxInteretService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/taux-interet")
public class TauxInteretController {

    @Autowired
    private TauxInteretService tauxInteretService;

    @PostMapping
    public TauxInteret creerTauxInteret(@RequestBody TauxInteret tauxInteret) {
        return tauxInteretService.creerTauxInteret(tauxInteret.getTaux(), tauxInteret.getDescription());
    }

    @PutMapping("/{id}")
    public TauxInteret mettreAJourTauxInteret(@PathVariable Long id, @RequestBody TauxInteret tauxInteret) {
        return tauxInteretService.mettreAJourTauxInteret(id, tauxInteret.getTaux(), tauxInteret.getDescription());
    }

    @DeleteMapping("/{id}")
    public void supprimerTauxInteret(@PathVariable Long id) {
        tauxInteretService.supprimerTauxInteret(id);
    }

    @GetMapping
    public List<TauxInteret> getAllTauxInteret() {
        return tauxInteretService.getAllTauxInteret();
    }
}