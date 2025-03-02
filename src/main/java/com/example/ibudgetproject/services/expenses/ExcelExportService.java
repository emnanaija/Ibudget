package com.example.ibudgetproject.services.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.repositories.expenses.DepenseRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {

    @Autowired
    private DepenseRepository depenseRepository;

    public void generateExcelReport() throws IOException {
        // Récupérer toutes les dépenses avec leurs catégories
        List<Depense> depenses = depenseRepository.findAll();

        // Créer un classeur Excel
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Dépenses");

        // Créer une ligne d'en-tête avec la colonne de la catégorie
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(1).setCellValue("Date");
        headerRow.createCell(2).setCellValue("Montant");
        headerRow.createCell(3).setCellValue("État");
        headerRow.createCell(4).setCellValue("Catégorie");

        // Remplir le fichier Excel avec les données des dépenses
        int rowNum = 1;
        for (Depense depense : depenses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(1).setCellValue(depense.getDate().toString());
            row.createCell(2).setCellValue(depense.getMontant());
            row.createCell(3).setCellValue(depense.getEtat().toString());

            // Ajouter la catégorie correspondante
            if (depense.getCategory() != null) {
                row.createCell(4).setCellValue(depense.getCategory().getNom());
            } else {
                row.createCell(4).setCellValue("Aucune catégorie");
            }
        }

        // Sauvegarder le fichier Excel dans un fichier
        try (FileOutputStream fileOut = new FileOutputStream("depenses_report.xlsx")) {
            workbook.write(fileOut);
        }

        // Fermer le classeur
        workbook.close();
    }
}
