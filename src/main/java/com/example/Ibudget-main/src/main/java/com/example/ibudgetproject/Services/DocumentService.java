package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
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

    @Autowired
    private ClaimRepository claimRepository ;

    @Override
    public Document createDocument(Document document, int claimId) { // Ajout de claimId comme paramètre
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));
        document.setClaim(claim);
        return documentRepository.save(document);
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
    public List<Document> getAllDocumentsByClaimId(int claimId) { // Ajout de la méthode pour récupérer par ClaimId
        return documentRepository.findByClaimId(claimId);
    }
}
