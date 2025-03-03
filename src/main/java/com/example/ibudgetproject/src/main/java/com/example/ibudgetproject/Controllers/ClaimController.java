package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.IClaimService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("claim")
@RestController
public class ClaimController {
    @Autowired
    private IClaimService claimService;

    @PostMapping("add")
    public Claim createClaim(@RequestBody Claim claim) {
        return claimService.createClaim(claim);
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


}
