package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.Document;
import jakarta.mail.MessagingException;

import java.io.IOException;
import java.util.List;

public interface IDocumentService {

    Document createDocument(Document document,int claimId) throws IOException;;
    Document updateDocument(Document document);
    void deleteDocument(Long id) ;
    Document getDocumentByid(Long id) ;
    List<Document> getAllDocumentsByClaimId(int claimId);
    void  sendTestEmail() throws MessagingException;
}
