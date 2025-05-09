package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.Document;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.IDocumentService;
import com.example.ibudgetproject.Services.IInsuranceService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("document")
public class DocumentController {
    @Autowired
    private IDocumentService documentService;

    @PostMapping("add/{claimId}")
    public ResponseEntity<?> createDocument(
            @RequestBody Document document,
            @PathVariable int claimId) {
        try {
            Document createdDocument = documentService.createDocument(document, claimId);
            return new ResponseEntity<>(createdDocument, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Erreur lors de la lecture du PDF : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/test")
    public ResponseEntity<String> testEmail() {
        try {
            documentService.sendTestEmail();
            return ResponseEntity.ok("Email de test envoyé avec succès !");
        } catch (MessagingException e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'envoi de l'email : " + e.getMessage());
        }
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
