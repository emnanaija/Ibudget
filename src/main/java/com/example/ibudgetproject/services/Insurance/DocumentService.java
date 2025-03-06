package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.Claim;
import com.example.ibudgetproject.entities.Insurance.Document;
import com.example.ibudgetproject.repositories.Insurance.ClaimRepository;
import com.example.ibudgetproject.repositories.Insurance.DocumentRepository;
import com.example.ibudgetproject.utilities.PdfExtractor;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class DocumentService implements IDocumentService{
    @Autowired
    private DocumentRepository documentRepository ;

    @Autowired
    private ClaimRepository claimRepository ;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private EmailService emailService ;
    @Override
    public Document createDocument(Document document, int claimId) throws IOException {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
        String pdfText = PdfExtractor.extractTextFromPdf(document.getFilePath());
        double estimatedAmount = geminiService.estimateAmount(pdfText, claim.getClaim_name(), claim.getDescription());

        double threshold = 0.1 * claim.getClaimed_amount();
        boolean isFraudulent = Math.abs(estimatedAmount - claim.getClaimed_amount()) > threshold;

        document.setClaim(claim);
        documentRepository.save(document); // Sauvegarde du document, qu'il soit frauduleux ou non

        if (isFraudulent) {
            claim.setExpert_report(false);
            claimRepository.save(claim);

            throw new RuntimeException("Document frauduleux détecté. Montant estimé : " + estimatedAmount +
                    ", montant réclamé : " + claim.getClaimed_amount() + ". Différence significative détectée.");
        } else {
            claim.setExpert_report(true);
            claimRepository.save(claim);
        }

        return document; // Retourne le document sauvegardé
    }
    private void sendFraudulentEmail(Claim claim, double estimatedAmount) {
        String recipientEmail = "loudjeinbouguerra@gmail.com";
        String subject = "Réclamation frauduleuse détectée";
        String htmlContent = "<html><body>" +
                "<h1>Réclamation frauduleuse détectée</h1>" +
                "<p>Le document que vous avez soumis pour la réclamation \"" + claim.getClaim_name() +
                "\" a été détecté comme frauduleux.</p>" +
                "<p>Montant estimé : <strong>" + estimatedAmount + "</strong></p>" +
                "<p>Montant réclamé : <strong>" + claim.getClaimed_amount() + "</strong></p>" +
                "<p>Différence significative détectée. </p>" +
                "</body></html>";
        try {
            emailService.sendHtmlEmail(recipientEmail, subject, htmlContent);
        } catch (MessagingException e) {
            throw new RuntimeException("Erreur lors de l'envoi de l'e-mail : " + e.getMessage());
        }
    }

    @Override
    public Document updateDocument(Document document) {
        if (documentRepository.existsById(document.getId())) {
            return documentRepository.save(document);
        } else {
            throw new RuntimeException("document not found with id: " + document.getId());
        }
    }

@Override
    public void sendTestEmail() throws MessagingException {
        String recipientEmail = "loudjeinbouguerra@gmail.com";
        String subject = "Test Email";
        String htmlContent = "<html><body><h1>Ceci est un email de test</h1></body></html>";

        emailService.sendHtmlEmail(recipientEmail, subject, htmlContent);
    }
    @Override
    public void deleteDocument(Long id ) {
        if (documentRepository.existsById(id)) {
            documentRepository.deleteById(id);
        } else {

            throw new RuntimeException("document not found with id: " + id);
        }
    }

    @Override
    public Document getDocumentByid(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("document not found with id: " + id));

    }

    @Override
    public List<Document> getAllDocumentsByClaimId(int claimId) { // Ajout de la méthode pour récupérer par ClaimId
        return documentRepository.findByClaimId(claimId);
    }
}
