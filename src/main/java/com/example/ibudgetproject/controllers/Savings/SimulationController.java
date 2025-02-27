package com.example.ibudgetproject.controllers.Savings;

import com.example.ibudgetproject.DTO.Savings.SimulationResultDTO;
import com.example.ibudgetproject.services.MonteCarloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/simulation")
public class SimulationController {

    @Autowired
    private MonteCarloService simulationService;

    @GetMapping("/montecarlo")
    public SimulationResultDTO simulerMonteCarlo(@RequestParam Long compteId, @RequestParam int dureeAnnees) {
        return simulationService.simulerMonteCarlo(compteId,dureeAnnees);
    }
}
