package com.example.ibudgetproject.controllers.Insurance;


import com.example.ibudgetproject.entities.Insurance.Claim;
import com.example.ibudgetproject.services.Insurance.IClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("claim")
@RestController
public class ClaimController {
    @Autowired
    private IClaimService claimService;

    @PostMapping("add/{insuranceId}")
    public Claim createClaim(@PathVariable int insuranceId, @RequestBody Claim claim) {
        return claimService.createClaimForInsurance(insuranceId, claim);
    }



    @PutMapping("/modify")
    public Claim updateInsurancePolicy(@RequestBody Claim claim) {
        return claimService.updateClaim(claim);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteClaim(@PathVariable int id) {
        claimService.deleteClaim(id);
    }

    @GetMapping("/getbyid/{id}")
    public Claim getClaimById(@PathVariable int id) {
        return claimService.getClaimByid(id);
    }

    @GetMapping("list")
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }
    @GetMapping("/insurance/{insuranceId}")
    public List<Claim> getClaimsByInsurance(@PathVariable int insuranceId) {
        return claimService.getClaimsByInsurance(insuranceId);
    }

}
