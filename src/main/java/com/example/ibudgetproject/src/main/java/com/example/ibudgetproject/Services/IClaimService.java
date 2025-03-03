package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.InsurancePolicy;

import java.util.List;

public interface IClaimService {
  Claim createClaim(Claim claim) ;
  Claim updateClaim(Claim claim);
  void deleteClaim(int id ) ;
  Claim getClaimByid(int id) ;
 List<Claim> getAllClaims() ;




}
