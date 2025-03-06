package com.example.ibudgetproject.services.Insurance;

import com.example.ibudgetproject.entities.Insurance.Document;
import jakarta.mail.MessagingException;

import java.io.IOException;
import java.util.List;

public interface IDocumentService {

    Document createDocument(Document document, int claimId) throws IOException;;
    Document updateDocument(Document document);
    void deleteDocument(Long id) ;
    Document getDocumentByid(Long id) ;
    List<Document> getAllDocumentsByClaimId(int claimId);
    void  sendTestEmail() throws MessagingException;
}
