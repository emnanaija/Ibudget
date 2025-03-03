package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.Compensation;

import java.util.List;

public interface ICompensationService {


    Compensation createCompensation(Compensation compensation) ;
    Compensation updateCompensation(Compensation compensation);
    void deleteCompensation(int id) ;
    Compensation getCompensationByid(int id) ;
    List<Compensation> getAllCompensations() ;
    Compensation processCompensation(Integer policyId);
}
