package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Repositories.ClaimRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ClaimService implements IClaimService{
    @Autowired
    private ClaimRepository claimRepository ;

    @Override
    public Claim createClaim(Claim claim) {
       return claimRepository.save(claim) ;
    }

    @Override
    public Claim updateClaim(Claim claim) {
        if (claimRepository.existsById(claim.getId())) {
            return claimRepository.save(claim);
        } else {
            throw new RuntimeException("Claim not found with id: " + claim.getId());
        }
    }

    @Override
    public void deleteClaim(int id ) {

        if (claimRepository.existsById(id)) {
            claimRepository.deleteById(id);
        } else {

            throw new RuntimeException("Claim not found with id: " + id);
        }

    }

    @Override
    public Claim getClaimByid(int id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
    }

    @Override
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }
}
