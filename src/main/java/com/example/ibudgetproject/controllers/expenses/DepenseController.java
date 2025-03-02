package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.services.expenses.DepenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/depenses")
public class DepenseController {

    @Autowired
    private DepenseService depenseService;



    // ✅ Créer une dépense
    @PostMapping("/ajoutManuel")
    public ResponseEntity<Depense> createDepenseManuelle(@RequestBody Depense depense) {
        // Appel à la méthode createDepenseManuelle du service
        Depense createdDepense = depenseService.createDepenseManuelle(depense);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDepense); // Retourner la dépense créée
    }


    // ✅ Mettre à jour une dépense
    @PutMapping("/{id}")
    public ResponseEntity<Depense> updateDepense(@PathVariable Long id, @RequestBody Depense depenseDetails) {
        Depense updatedDepense = depenseService.updateDepense(id, depenseDetails);
        return new ResponseEntity<>(updatedDepense, HttpStatus.OK);
    }

    // ✅ Supprimer une dépense
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepense(@PathVariable Long id) {
        depenseService.deleteDepense(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // ✅ Afficher toutes les dépenses
    @GetMapping
    public ResponseEntity<List<Depense>> getAllDepenses() {
        List<Depense> depenses = depenseService.getAllDepenses();
        return new ResponseEntity<>(depenses, HttpStatus.OK);
    }

    // ✅ Afficher une dépense par ID
    @GetMapping("/{id}")
    public ResponseEntity<Depense> getDepenseById(@PathVariable Long id) {
        Depense depense = depenseService.getDepenseById(id);
        return new ResponseEntity<>(depense, HttpStatus.OK);
    }
    @GetMapping("/wallet/{walletId}")
    public List<Depense> getDepensesByWalletId(@PathVariable Long walletId) {
        System.out.println("Récupération des dépenses pour le walletId : " + walletId);  // Ajoute un log
        return depenseService.getDepensesByWalletId(walletId);
    }
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Le fichier est vide.");
        }

        // Sauvegarde temporaire du fichier
        String filePath = System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename();
        File imageFile = new File(filePath);
        try {
            file.transferTo(imageFile);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'enregistrement du fichier.");
        }

        // Extraction des informations et création de l'objet Depense
        Depense depense = depenseService.saveDepenseFromImage(imageFile, imageFile.getAbsolutePath());



        return ResponseEntity.ok("Fichier reçu et dépense enregistrée avec succès : " + file.getOriginalFilename());
    }


    @GetMapping("/wallet/{walletId}/mois/{mois}/annee/{annee}")
    public List<Depense> getDepensesByWalletAndMonth(@PathVariable Long walletId, @PathVariable int mois, @PathVariable int annee) {
        return depenseService.getDepensesForMonth(walletId, mois, annee);
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Depense>> generateDepenses(@RequestParam int numberOfDepenses) {
        try {
            // Appel du service pour générer les dépenses
            List<Depense> depenses = depenseService.generateAndSaveDepensesWithOutliers(numberOfDepenses);
            return new ResponseEntity<>(depenses, HttpStatus.CREATED); // Retourne les dépenses générées avec le statut 201
        } catch (Exception e) {
            // En cas d'erreur
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
