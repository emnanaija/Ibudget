package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.Claim;
import com.example.ibudgetproject.entities.Insurance.Document;
import com.example.ibudgetproject.repositories.Insurance.ClaimRepository;
import com.example.ibudgetproject.repositories.Insurance.DocumentRepository;
import com.example.ibudgetproject.utilities.PdfExtractor;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DocumentService implements IDocumentService {
    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @Autowired
    private GeminiGService geminiService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private EmaillService emailService;

    @Override
    public Document createDocument(MultipartFile file, String documentType, String description, int claimId) throws IOException {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));

        // Sauvegarde du fichier
        String filePath = saveFile(file);

        // Log pour vérification
        System.out.println("File saved at: " + filePath);
        System.out.println("File exists: " + new File(filePath).exists());

        Document document = new Document();
        document.setFilePath(filePath);
        document.setDocumentType(documentType);
        document.setDescription(description);
        document.setOriginalFileName(file.getOriginalFilename());
        document.setFileSize(String.valueOf(file.getSize()));
        document.setMimeType(file.getContentType());
        document.setClaim(claim);

        // Enregistrer le document d'abord
        Document savedDocument = documentRepository.save(document);
        System.out.println("Document saved with ID: " + savedDocument.getId());

        // Vérification de fraude uniquement pour les PDF
        if ("pdf".equalsIgnoreCase(documentType.toLowerCase())) {
            try {
                String pdfText = PdfExtractor.extractTextFromPdf(filePath);
                double estimatedAmount = geminiService.estimateAmount(
                        pdfText,
                        claim.getClaim_name(),
                        claim.getDescription()
                );

                double threshold = 0.1 * claim.getClaimed_amount();
                boolean isFraudulent = Math.abs(estimatedAmount - claim.getClaimed_amount()) > threshold;

                if (isFraudulent) {
                    claim.setExpert_report(false);
                    claimRepository.save(claim);
                    sendFraudulentEmail(claim, estimatedAmount);
                    throw new RuntimeException("Document frauduleux détecté. Montant estimé : " + estimatedAmount +
                            ", montant réclamé : " + claim.getClaimed_amount());
                }
            } catch (Exception e) {
                // Ne pas supprimer le document même en cas de fraude
                System.err.println("Fraud check failed but keeping document: " + e.getMessage());
            }
        }

        claim.setExpert_report(true);
        claimRepository.save(claim);

        return savedDocument;
    }
    private String saveFile(MultipartFile file) throws IOException {
        // Utilise le répertoire de travail du projet
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";

        // Crée le dossier s'il n'existe pas
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Nom du fichier à enregistrer
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path filePath = uploadPath.resolve(fileName);

        // Sauvegarde le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath.toString();
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
    public void deleteDocument(Long id) {
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
    public List<Document> getAllDocumentsByClaimId(int claimId) {
        return documentRepository.findByClaimId(claimId);
    }
}