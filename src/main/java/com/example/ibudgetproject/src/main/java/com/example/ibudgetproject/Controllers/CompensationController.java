package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.ICompensationService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("compensation")
public class CompensationController {
    @Autowired
    private ICompensationService compensationService;

    @PostMapping("add")
    public Compensation createCompensation(@RequestBody Compensation compensation) {
        return compensationService.createCompensation(compensation);
    }



    @PutMapping("/modify")
    public Compensation updateCompensation(@RequestBody Compensation compensation) {
        return compensationService.updateCompensation(compensation);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteCompensation(@PathVariable int id) {
        compensationService.deleteCompensation(id);
    }

    @GetMapping("/getbyid/{id}")
    public Compensation getCompensation(@PathVariable int id) {
        return compensationService.getCompensationByid(id);
    }

    @GetMapping("list")
    public List<Compensation> getAllCompensations() {
        return compensationService.getAllCompensations();
    }



    @PostMapping("/process/{policyId}")
    public ResponseEntity<String> processCompensation(@PathVariable int policyId) {
        Compensation compensation = compensationService.processCompensation(policyId);
        return ResponseEntity.ok("Compensation enregistrée : " + compensation.getAmount_paid() + " €");
    }
}
