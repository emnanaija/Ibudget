package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.Claim;

import java.util.List;

public interface IClaimService {
    Claim createClaimForInsurance(int insuranceId, Claim claim);
    Claim updateClaim(Claim claim);
    void deleteClaim(int id ) ;
    Claim getClaimByid(int id) ;
    List<Claim> getAllClaims() ;
    List<Claim> getClaimsByInsurance(int insuranceId);


    void confirmClaim(int claimId);
    void rejectClaim(int claimId);


}