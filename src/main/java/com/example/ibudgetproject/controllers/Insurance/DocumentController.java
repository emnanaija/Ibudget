package com.example.ibudgetproject.controllers.Insurance;


import com.example.ibudgetproject.entities.Insurance.Document;
import com.example.ibudgetproject.services.Insurance.IDocumentService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("document")
public class DocumentController {
    @Autowired
    private IDocumentService documentService;

    @PostMapping(value = "/add/{claimId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false) String description,
            @PathVariable int claimId) {

        try {
            // Validation du type de document
            if (!List.of("pdf", "image", "video").contains(documentType.toLowerCase())) {
                return ResponseEntity.badRequest().body("Type de document non supporté");
            }

            Document document = documentService.createDocument(file, documentType, description, claimId);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Erreur lors de l'enregistrement du fichier");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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