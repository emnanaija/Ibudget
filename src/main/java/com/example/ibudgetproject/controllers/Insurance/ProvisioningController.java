package com.example.ibudgetproject.controllers.Insurance;

import com.example.ibudgetproject.services.Insurance.ProvisioningService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/provisioning")

public class ProvisioningController {

    @Autowired
    private ProvisioningService provisioningService;

    @GetMapping("/generateReport")
    public void generateExcelReport(HttpServletResponse response) throws IOException {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=ProvisioningReport.xlsx");

        provisioningService.generateProvisioningReport(response);
    }

}
