package com.example.ibudgetproject.controllers.Savings;


import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.services.Savings.DepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.math.BigDecimal;

@RestController
@RequestMapping("/depot")
public class DepotController {
    @Autowired
    private DepotService depotService;

    @GetMapping
    public List<Depot> getAllDepots() {
        return depotService.getAllDepots();
    }

    @GetMapping("/{id}")
    public Depot getDepotById(@PathVariable Long id) {
        return depotService.getDepotById(id);
    }

    @PostMapping
    public Depot createDepot(@RequestBody Depot depot) {
        return depotService.saveDepot(depot);
    }
    @PutMapping("/{id}")
    public Depot updateDepot(@PathVariable Long id, @RequestBody Depot updatedDepot) {
        return depotService.updateDepot(id, updatedDepot);
    }
    @DeleteMapping("/{id}")
    public void deleteDepot(@PathVariable Long id) {
        depotService.deleteDepot(id);
    }

    @GetMapping("/simuler")
    public BigDecimal simulerDepotsRecurrents(
            @RequestParam Long compteId,
            @RequestParam BigDecimal montant,
            @RequestParam String frequence,
            @RequestParam int dureeEnMois) {
        return depotService.simulerDepotsRecurrents(compteId, montant, frequence, dureeEnMois);
    }

}

