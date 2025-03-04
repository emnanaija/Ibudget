package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.Document;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.IDocumentService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("document")
public class DocumentController {
    @Autowired
    private IDocumentService documentService;

    @PostMapping("add/{claimId}") // Ajout de claimId dans l'URL
    public Document createDocument(
            @RequestBody Document document,
            @PathVariable int claimId) { // Récupération de claimId
        return documentService.createDocument(document, claimId);
    }

    @PutMapping("/modify")
    public Document updateDocument(@RequestBody Document document) {
        return documentService.updateDocument(document);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
    }

    @GetMapping("/getbyid/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentService.getDocumentByid(id);
    }

    @GetMapping("list/{claimId}") // Ajout pour récupérer les documents par claimId
    public List<Document> getAllDocumentsByClaimId(@PathVariable int claimId) {
        return documentService.getAllDocumentsByClaimId(claimId);
    }

}
