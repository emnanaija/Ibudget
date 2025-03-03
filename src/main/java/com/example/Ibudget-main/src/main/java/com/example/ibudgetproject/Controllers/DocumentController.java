package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.Document;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.IDocumentService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("document")
public class DocumentController {
    @Autowired
    private IDocumentService documentService;

    @PostMapping("add")
    public Document createDocument(@RequestBody Document document) {
        return documentService.createDocument(document);
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

    @GetMapping("list")
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

}
