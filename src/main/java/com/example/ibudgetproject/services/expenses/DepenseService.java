package com.example.ibudgetproject.services.expenses;


import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.entities.expenses.EtatDepense;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.entities.expenses.SpendingWallet;
import com.example.ibudgetproject.repositories.expenses.DepenseRepository;
import com.example.ibudgetproject.repositories.expenses.ExpenseCategoryRepository;
import com.example.ibudgetproject.repositories.expenses.SpendingWalletRepository;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class DepenseService {

    @Autowired
    private DepenseRepository depenseRepository;
    @Autowired
    private ExpenseCategoryRepository categoryRepository;
    @Autowired
    private SpendingWalletRepository walletRepository;

    // ✅ Créer une dépense manuelle
    private static final Logger logger = LoggerFactory.getLogger(DepenseService.class);

    public Depense createDepenseManuelle(Depense depense) {
        // Vérification de la catégorie, si elle est nulle, on la définit par défaut sur "other"
        if (depense.getCategory() == null) {
            ExpenseCategory defaultCategory = categoryRepository.findByNom("other")
                    .orElseThrow(() -> new RuntimeException("Catégorie 'other' non trouvée !"));
            depense.setCategory(defaultCategory);
        }

        if (depense.getDate() == null) {
            depense.setDate(LocalDate.now()); // Utilise la date actuelle
        }

        depense.setPhotoUrl(null);

        // Récupérer le wallet lié à la dépense

        SpendingWallet wallet = walletRepository.findById(depense.getWallet().getId()).orElseThrow(() -> new RuntimeException("Wallet not found"));
        logger.info("Wallet ID: {}, Solde: {}", wallet.getId(), wallet.getSolde());
        // Vérifier si le wallet a assez de fonds
        if (wallet.getSolde() < depense.getMontant()) {
            throw new RuntimeException("Fonds insuffisants dans le wallet !");
        }

        // Déduire le montant de la dépense du wallet
        wallet.setSolde(wallet.getSolde() - depense.getMontant());

        // Mettre à jour le montant dépensé de la catégorie
        ExpenseCategory category = depense.getCategory();
        category.setMontantDepensé(category.getMontantDepensé() + depense.getMontant());

        // Sauvegarder les mises à jour
        walletRepository.save(wallet);
        logger.info("Avant sauvegarde - ID: {}, Nom: {}, Budget: {}, Montant Dépensé: {}",
                category.getId(), category.getNom(), category.getBudgetAlloué(), category.getMontantDepensé());

        categoryRepository.save(category);

        // Enregistrer la dépense dans la base de données
        return depenseRepository.save(depense);
    }


//ajout par ticket





    // ✅ Mettre à jour une dépense
    public Depense updateDepense(Long id, Depense depenseDetails) {
        Optional<Depense> existingDepense = depenseRepository.findById(id);
        if (existingDepense.isPresent()) {
            Depense depense = existingDepense.get();
            depense.setMontant(depenseDetails.getMontant());
            depense.setDate(depenseDetails.getDate());
            depense.setEtat(depenseDetails.getEtat());
            depense.setWallet(depenseDetails.getWallet());
            depense.setCategory(depenseDetails.getCategory());
            return depenseRepository.save(depense);
        } else {
            throw new RuntimeException("Dépense non trouvée !");
        }
    }

    // ✅ Supprimer une dépense
    public void deleteDepense(Long id) {
        if (!depenseRepository.existsById(id)) {
            throw new RuntimeException("Dépense non trouvée !");
        }
        depenseRepository.deleteById(id);
    }

    // ✅ Afficher toutes les dépenses
    public List<Depense> getAllDepenses() {
        return depenseRepository.findAll();
    }


    // ✅ Afficher une dépense par ID
    public Depense getDepenseById(Long id) {
        return depenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dépense non trouvée !"));
    }
    public List<Depense> getDepensesByWalletId(Long walletId) {
        return depenseRepository.findByWalletId(walletId);
    }



    /**
     * 🔍 Convertit une image en texte avec Tesseract
     */
    public String extractTextFromImage(File imageFile) {
        ITesseract tesseract = new Tesseract();
        tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
        tesseract.setLanguage("eng"); // Français

        try {
            return tesseract.doOCR(imageFile);
        } catch (TesseractException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 🔢 Extrait le montant total du texte
     */
    public String extractTotalAmount(String extractedText) {
        Pattern pattern = Pattern.compile("Total\\s+([\\d.,]+)\\s*DT", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(extractedText);

        if (matcher.find()) {
            return matcher.group(1).replace(",", "."); // Convertit 41,500 en 41.500
        }
        return null;
    }

    /**
     * 📅 Extrait la date du texte
     */
    public String extractDate(String extractedText) {
        Pattern pattern = Pattern.compile("(\\d{2}/\\d{2}/\\d{4})");
        Matcher matcher = pattern.matcher(extractedText);

        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * 📥 Extrait les informations depuis une image et les stocke en base
     */
    public Depense saveDepenseFromImage(File imageFile, String imageUrl) {
        String extractedText = extractTextFromImage(imageFile);
        System.out.println("Texte extrait : " + extractedText);

        if (extractedText == null) {
            throw new RuntimeException("Impossible d'extraire du texte de l'image.");
        }

        String totalAmount = extractTotalAmount(extractedText);
        String dateString = extractDate(extractedText);

        if (totalAmount == null) {
            throw new RuntimeException("Montant total non trouvé.");
        }

        // Convertir la date ou utiliser la date du jour
        LocalDate date = (dateString != null) ? LocalDate.parse(dateString, DateTimeFormatter.ofPattern("dd/MM/yyyy")) : LocalDate.now();

        // Assigner des valeurs par défaut
        SpendingWallet defaultWallet = walletRepository.findById(1L).orElseThrow(() -> new RuntimeException("Wallet non trouvé"));
        ExpenseCategory defaultCategory = categoryRepository.findByNom("other") .orElseThrow(() -> new RuntimeException("Catégorie 'other' non trouvée !"));; // Facultatif

        // Création et sauvegarde de la dépense
        Depense depense = Depense.builder()
                .date(date)
                .montant(Double.parseDouble(totalAmount))
                .etat(EtatDepense.REALISEE)  // Valeur par défaut
                .wallet(defaultWallet)
                .category(defaultCategory)
                .photoUrl(imageUrl)
                .build();

        return depenseRepository.save(depense);
    }

    public List<Depense> getDepensesForMonth(Long walletId, int month, int year) {
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        // Utiliser la méthode du repository qui inclut déjà le filtrage sur l'état "REALISEE"
        return depenseRepository.findByWalletIdAndDateBetweenAndEtat(walletId, startOfMonth, endOfMonth, EtatDepense.REALISEE);
    }









}

