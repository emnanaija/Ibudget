package com.example.ibudgetproject.services.Insurance;

import com.example.ibudgetproject.entities.Insurance.Document;
import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
public interface IDocumentService {
    // Update the method signature to match the implementation
    Document createDocument(MultipartFile file, String documentType, String description, int claimId) throws IOException;

    Document updateDocument(Document document);

    void deleteDocument(Long id);

    Document getDocumentByid(Long id);

    List<Document> getAllDocumentsByClaimId(int claimId);

    void sendTestEmail() throws MessagingException;
}