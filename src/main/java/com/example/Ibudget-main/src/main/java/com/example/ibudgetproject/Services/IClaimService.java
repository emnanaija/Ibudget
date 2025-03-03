package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.InsurancePolicy;

import java.util.List;

public interface IClaimService {
    Claim createClaimForInsurance(int insuranceId, Claim claim);
  Claim updateClaim(Claim claim);
  void deleteClaim(int id ) ;
  Claim getClaimByid(int id) ;
 List<Claim> getAllClaims() ;
    List<Claim> getClaimsByInsurance(int insuranceId);





}
