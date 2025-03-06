package com.example.ibudgetproject.controllers.Savings;

import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.services.Savings.CompteEpargneService;
import com.example.ibudgetproject.services.Savings.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

import java.util.List;

@RestController
@RequestMapping("/compte-epargne")
public class CompteEpargneController {
    @Autowired
    private CompteEpargneService compteEpargneService;
    @Autowired
    private PdfService pdfService;

    @GetMapping
    public List<CompteEpargne> getAllCompteEpargnes() {
        return compteEpargneService.getAllCompteEpargnes();
    }

    @GetMapping("/{id}")
    public CompteEpargne getCompteEpargneById(@PathVariable Long id) {
        return compteEpargneService.getCompteEpargneById(id);
    }

    @PostMapping
    public CompteEpargne createCompteEpargne(@RequestParam Long userId,@RequestBody CompteEpargne compteEpargne,@RequestParam Long simCardId) {
        return compteEpargneService.saveCompteEpargne(userId,compteEpargne,simCardId);
    }
    @PutMapping("/{id}")
    public CompteEpargne updateCompteEpargne(@PathVariable Long id, @RequestBody CompteEpargne updatedCompteEpargne) {
        return compteEpargneService.updateCompteEpargne(id, updatedCompteEpargne);
    }

    @DeleteMapping("/{id}")
    public void deleteCompteEpargne(@PathVariable Long id) {
        compteEpargneService.deleteCompteEpargne(id);
    }

    @GetMapping("/{id}/calcul-interets")
    public BigDecimal calculerInterets(@PathVariable Long id, @RequestParam int dureeEnMois) {
        return compteEpargneService.calculerMontantAvecInterets(id, dureeEnMois);
    }

    @PutMapping("/{id}/associer-taux-interet")
    public CompteEpargne associerTauxInteret(@PathVariable Long id, @RequestParam Long tauxInteretId) {
        return compteEpargneService.associerTauxInteret(id, tauxInteretId);
    }
    @GetMapping("/historique-depot/pdf")
    public ResponseEntity<byte[]> getDepotHistoriquePdf(@RequestParam Long compteId) {
        byte[] pdfData = pdfService.generateDepotHistoriquePdf(compteId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=depots.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfData);
    }
}
