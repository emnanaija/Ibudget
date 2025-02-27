package com.example.ibudgetproject.controllers.Savings;
import com.example.ibudgetproject.DTO.Savings.PlanEpargneDTO;
import com.example.ibudgetproject.entities.Savings.Objectif;
import com.example.ibudgetproject.services.Savings.ObjectifService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/objectif")
public class ObjectifController {
    @Autowired
    private ObjectifService objectifService;

    @GetMapping
    public List<Objectif> getAllObjectifs() {
        return objectifService.getAllObjectifs();
    }

    @GetMapping("/{id}")
    public Objectif getObjectifById(@PathVariable Long id) {
        return objectifService.getObjectifById(id);
    }

    @PostMapping
    public Objectif createObjectif(@RequestBody Objectif objectif) {
        return objectifService.saveObjectif(objectif);
    }
    @PutMapping("/{id}")
    public Objectif updateObjectif(@PathVariable Long id, @RequestBody Objectif updatedObjectif) {
        return objectifService.updateObjectif(id, updatedObjectif);
    }
    @DeleteMapping("/{id}")
    public void deleteObjectif(@PathVariable Long id) {
        objectifService.deleteObjectif(id);
    }

    @GetMapping("/{id}/plan-epargne")
    public PlanEpargneDTO getPlanEpargne(@PathVariable Long id) {
        return objectifService.estimerPlanEpargne(id);
    }

}
