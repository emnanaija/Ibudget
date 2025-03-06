package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Insurance.InsuranceRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;

import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.UnitValue;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)

public class InsuranceService implements IInsuranceService {


    @Autowired
    private InsuranceRepository insurancePolicyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        insurancePolicy.setUser(user);
        return insurancePolicyRepository.save(insurancePolicy);
    }
    @Override
    public InsurancePolicy updateInsurancePolicy(InsurancePolicy insurancePolicy) {

        if (insurancePolicyRepository.existsById(insurancePolicy.getInsurance_policy_id())) {
            return insurancePolicyRepository.save(insurancePolicy);
        } else {
            throw new RuntimeException("InsurancePolicy not found with id: " + insurancePolicy.getInsurance_policy_id());
        }
    }
    @Override
    public void deleteInsurancePolicy(int id) {

        if (insurancePolicyRepository.existsById(id)) {
            insurancePolicyRepository.deleteById(id);
        } else {

            throw new RuntimeException("InsurancePolicy not found with id: " + id);
        }
    }
    @Override
    public InsurancePolicy getInsurancePolicyById(int id) {
        return insurancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("InsurancePolicy not found with id: " + id));
    }

    @Override
    public List<InsurancePolicy> getAllInsurancePolicies() {
        List<InsurancePolicy> policies = insurancePolicyRepository.findAll();
        if (policies.isEmpty()) {
            throw new RuntimeException("No insurance policies found.");
        }
        return policies;
    }
    // Assurez-vous que le nom du fichier est exact// Remplacez par le chemin réel
    private static final String LOGO_PATH = "C://Users/LENOVO/Downloads/logoo.jfif"; // Remplacez par le chemin réel
    private static final String USER_IMAGE_PATH = "C://Users/LENOVO/Downloads/logo.png"; // Remplacez par le chemin réel
    private static final String SIGNATURE_PATH = "C://Users/LENOVO/Downloads/signature.png"; // Remplacez par le chemin réel
    public void generateContractPdfToDesktop(InsurancePolicy policy) throws IOException {
        String desktopPath = System.getProperty("user.home") + "/Desktop/contrat_assurance.pdf";
        PdfWriter writer = new PdfWriter(new FileOutputStream(desktopPath));
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        pdf.addNewPage();
        // Couleur de fond de la page
        document.setBackgroundColor(new DeviceRgb(240, 240, 240)); // Gris clair

        PdfFont timesRoman = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);

        // Cadre
        PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage()); // Utiliser PdfCanvas au lieu de Canvas
        canvas.setStrokeColor(ColorConstants.BLACK);
        canvas.rectangle(30, 30, pdf.getFirstPage().getPageSize().getWidth() - 60, pdf.getFirstPage().getPageSize().getHeight() - 60);
        canvas.stroke();

        // Logo en haut à gauche
        Image logo = new Image(ImageDataFactory.create(Files.readAllBytes(Paths.get(LOGO_PATH))));
        logo.setWidth(100);
        logo.setHorizontalAlignment(HorizontalAlignment.LEFT);
        logo.setFixedPosition(30, pdf.getFirstPage().getPageSize().getHeight() - 100);
        document.add(logo);

        // Titre
        Paragraph title = new Paragraph("CONTRAT D'ASSURANCE")
                .setFont(timesRoman)
                .setFontSize(24)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginTop(50);
        document.add(title);
        // Dates de souscription et d'expiration sous le titre
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedSubscriptionDate = policy.getSubscription_date().format(dateFormatter);
        String formattedExpirationDate = policy.getExpiration_date().format(dateFormatter);

        Paragraph DateParagraph = new Paragraph("Le contrat a commencé à " )
                .setFont(timesRoman)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT);
        Paragraph subscriptionDateParagraph = new Paragraph( formattedSubscriptionDate)
                .setFont(timesRoman)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT);
        Paragraph expirationDateParagraph = new Paragraph("et finit le " + formattedExpirationDate)
                .setFont(timesRoman)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT);
        document.add(DateParagraph);
        document.add(subscriptionDateParagraph);
        document.add(expirationDateParagraph);
        // Informations de l'utilisateur
        Paragraph userInfo = new Paragraph()
                .setFont(timesRoman)
                .setFontSize(12)
                .setMarginTop(30);
        userInfo.add("Nom : " + policy.getUser().getFirstName() + " " + policy.getUser().getLastName() + "\n");
        userInfo.add("Email : " + policy.getUser().getEmail() + "\n");
        userInfo.add("Téléphone : " + policy.getUser().getPhoneNumber() + "\n");
        userInfo.add("Profession : " + policy.getUser().getProfession() + "\n");
        userInfo.add("Sexe : " + policy.getUser().getGender() + "\n");
        document.add(userInfo);

        // Tableau des détails du contrat
        Table table = new Table(UnitValue.createPercentArray(new float[]{3, 7}))
                .useAllAvailableWidth()
                .setMarginTop(30)
                .setFont(timesRoman)
                .setFontSize(12);
        addTableRow(table, "Numéro de police :", String.valueOf(policy.getPolicy_number()));
        addTableRow(table, "Type d'assurance :", policy.getInsurance_type().toString());
        addTableRow(table, "Détails :", policy.getDetails());
        addTableRow(table, "Prime :", String.valueOf(policy.getPremium()));

        addTableRow(table, "Statut :", policy.getStatus());
        addTableRow(table, "Franchise :", String.valueOf(policy.getDeductible()));
        addTableRow(table, "Fréquence de paiement :", policy.getFrequency().toString());
        addTableRow(table, "CIN du garant :", policy.getGuarantor_cin());
        document.add(table);

        // Signature du client
        Paragraph signature = new Paragraph("Signature de l'assurance :")
                .setFont(timesRoman)
                .setFontSize(12)
                .setMarginTop(30);
        document.add(signature);
        Image signatureImage = new Image(ImageDataFactory.create(Files.readAllBytes(Paths.get(SIGNATURE_PATH))));
        signatureImage.setWidth(150);
        document.add(signatureImage);

        document.close();
        System.out.println("PDF créé sur le bureau : " + desktopPath);
    }

    // Fonction utilitaire pour ajouter une ligne au tableau
    private void addTableRow(Table table, String label, String value) {
        Cell labelCell = new Cell().add(new Paragraph(label));
        Cell valueCell = new Cell().add(new Paragraph(value));
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
/*
    public InsurancePolicy applyOffers(int insuranceId) {
        InsurancePolicy policy = getInsurancePolicyById(insuranceId);
        double calculatedPremium = policy.getPremium();

        if (calculatedPremium > 2000) {
            policy.setDetails(policy.getDetails() + " - Offre: Paiement échelonné disponible.");
        }
        if(userHasMultiplePolicies(policy.getUser().getIdUser())){ // Modification ici
            policy.setPremium(calculatedPremium * 0.95);
            policy.setDetails(policy.getDetails() + " - Offre: 5% de réduction pour regroupement de polices.");
        }

        return insurancePolicyRepository.save(policy);
    }

    private boolean userHasMultiplePolicies(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return insurancePolicyRepository.findByUserId(userId).size() > 1;
    }*/










}
