package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Repositories.ClaimRepository;
import com.example.ibudgetproject.Repositories.CompensationRepository;
import com.example.ibudgetproject.Repositories.InsuranceRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CompensationService implements ICompensationService{
    @Autowired
    private CompensationRepository compensationRepository ;
    @Autowired
    private InsuranceRepository insurancePolicyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Override
    public Compensation createCompensation(Compensation compensation) {
        return compensationRepository.save(compensation) ;
    }

    @Override
    public Compensation updateCompensation(Compensation compensation) {
        if (compensationRepository.existsById(compensation.getId())) {
            return compensationRepository.save(compensation);
        } else {
            throw new RuntimeException("Compensation not found with id: " + compensation.getId());
        }
    }

    @Override
    public void deleteCompensation(int id ) {

        if (compensationRepository.existsById(id)) {
            compensationRepository.deleteById(id);
        } else {

            throw new RuntimeException("Compensation not found with id: " + id);
        }

    }

    @Override
    public Compensation getCompensationByid(int id) {
        return compensationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compensation not found with id: " + id));
    }

    @Override
    public List<Compensation> getAllCompensations() {
        return compensationRepository.findAll();
    }






}
