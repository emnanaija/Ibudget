package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.Document;

import java.util.List;

public interface IDocumentService {

    Document createDocument(Document document) ;
    Document updateDocument(Document document);
    void deleteDocument(Long id) ;
    Document getDocumentByid(Long id) ;
    List<Document> getAllDocuments() ;
}
