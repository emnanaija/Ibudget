package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Document;
import com.example.ibudgetproject.Repositories.ClaimRepository;
import com.example.ibudgetproject.Repositories.CompensationRepository;
import com.example.ibudgetproject.Repositories.DocumentRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class DocumentService implements IDocumentService{
    @Autowired
    private DocumentRepository documentRepository ;

    @Override
    public Document createDocument(Document document) {
        return documentRepository.save(document) ;
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
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }
}
