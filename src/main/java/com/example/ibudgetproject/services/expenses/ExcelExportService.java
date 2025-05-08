package com.example.ibudgetproject.services.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.repositories.expenses.DepenseRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelExportService {

    @Autowired
    private DepenseRepository depenseRepository;


    public ExcelExportService(DepenseRepository depenseRepository) {
        this.depenseRepository = depenseRepository;
    }

    public byte[] generateExcelReport() throws IOException {
        List<Depense> depenses = depenseRepository.findAll();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Dépenses");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(1).setCellValue("Date");
        headerRow.createCell(2).setCellValue("Montant");
        headerRow.createCell(3).setCellValue("État");
        headerRow.createCell(4).setCellValue("Catégorie");

        int rowNum = 1;
        for (Depense depense : depenses) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(1).setCellValue(depense.getDate().toString());
            row.createCell(2).setCellValue(depense.getMontant());
            row.createCell(3).setCellValue(depense.getEtat().toString());

            if (depense.getCategory() != null) {
                row.createCell(4).setCellValue(depense.getCategory().getNom());
            } else {
                row.createCell(4).setCellValue("Aucune catégorie");
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }
}
