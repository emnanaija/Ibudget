package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Services.ProvisioningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/provisioning")

public class ProvisioningController {

    @Autowired
    private ProvisioningService provisioningService;

    @GetMapping("/generateReport")
    public ResponseEntity<FileSystemResource> generateProvisioningReport() throws IOException {
        provisioningService.generateProvisioningReport();

        File file = new File("ProvisioningReport.xlsx");
        FileSystemResource resource = new FileSystemResource(file);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ProvisioningReport.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(resource);
    }

}
