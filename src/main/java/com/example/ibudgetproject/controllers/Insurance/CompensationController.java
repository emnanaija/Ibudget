package com.example.ibudgetproject.controllers.Insurance;


import com.example.ibudgetproject.entities.Insurance.Compensation;
import com.example.ibudgetproject.services.Insurance.ICompensationService;
import org.springframework.beans.factory.annotation.Autowired;
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





}
