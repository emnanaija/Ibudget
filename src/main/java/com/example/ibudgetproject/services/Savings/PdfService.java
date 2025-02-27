package com.example.ibudgetproject.services.Savings;

import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.entities.Savings.DepotLog;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import com.example.ibudgetproject.repositories.Savings.DepotLogRepository;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    @Autowired
    private CompteEpargneRepository compteEpargneRepository;
    @Autowired
    private DepotLogRepository depotLogRepository;

    public byte[] generateDepotHistoriquePdf(Long compteId) {
        // Récupérer le compte épargne
        CompteEpargne compte = compteEpargneRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        List<Depot> depots = compte.getDepots();
        List<DepotLog> depotsSupprimes = compte.getDepotsSupprimes();

        // Création du fichier PDF en mémoire
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Titre du PDF
        document.add(new Paragraph("Historique des Dépôts du Compte Épargne")
                .setBold()
                .setFontSize(16));

        // Création du tableau avec 3 colonnes
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 3, 3, 4}))
                .useAllAvailableWidth();

        // Ajouter l'en-tête du tableau
        table.addHeaderCell("Montant (DT)");
        table.addHeaderCell("Fréquence");
        table.addHeaderCell("Date de création");
        table.addHeaderCell("Status");


        // Remplir le tableau avec les dépôts
        for (Depot depot : depots) {
            table.addCell(depot.getMontant().toString());
            table.addCell(depot.getFrequenceDepot() != null ? depot.getFrequenceDepot() : "N/A");
            table.addCell(depot.getDateDepot().toString());
            table.addCell("Actif");

        }


        for (DepotLog depot : depotsSupprimes) {
            table.addCell((depot.getMontant().toString()));
            table.addCell((depot.getFrequenceDepot()));
            table.addCell((depot.getDateDepot().toString()));
            table.addCell("Annulé");
        }

        document.add(table);
        document.close();

        return outputStream.toByteArray();
    }

}
