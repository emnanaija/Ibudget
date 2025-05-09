package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.entities.Insurance.InsuranceStatisticsDTO;
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
import jakarta.persistence.EntityNotFoundException;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service
@FieldDefaults(level = AccessLevel.PRIVATE)

public class InsuranceService implements IInsuranceService {


    @Autowired
    private InsuranceRepository insurancePolicyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiGService geminiService;




    private synchronized String generateNextPolicyNumber() {
        Long maxNumber = insurancePolicyRepository.findMaxPolicyNumberAsLong();
        if (maxNumber == null) {
            return "POL-1000"; // Format initial si aucune police existe
        }
        return "POL-" + (maxNumber + 1); // Incrémente le numéro
    }

    @Override
    public void activateInsurancePolicy(int id) {
        InsurancePolicy policy = insurancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("InsurancePolicy not found with id: " + id));

        if ("EXPIRED".equals(policy.getStatus())) {
            throw new IllegalStateException("Cannot activate an expired policy");
        }

        policy.setStatus("ACTIVE");
        insurancePolicyRepository.save(policy);
    }

    @Override
    public void deactivateInsurancePolicy(int id) {
        InsurancePolicy policy = insurancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("InsurancePolicy not found with id: " + id));

        policy.setStatus("INACTIVE");
        insurancePolicyRepository.save(policy);
    }

    // Statistiques par type d'assurance (count)
    @Override
    public Map<String, Long> getInsuranceTypeStatistics() {
        return insurancePolicyRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        policy -> policy.getInsurance_type()
                                .toString(),
                        Collectors.counting()
                ));
    }

    // Statistiques complètes (DTO)
    @Override
    public InsuranceStatisticsDTO getAllInsuranceStatistics() {
        InsuranceStatisticsDTO stats = new InsuranceStatisticsDTO();

        // Totaux
        stats.setTotalPolicies(insurancePolicyRepository.count());
        stats.setTotalActiveInsurance(insurancePolicyRepository.countByStatus("ACTIVE"));
        stats.setTotalExpiredInsurance(insurancePolicyRepository.countByStatus("EXPIRED"));

        // Calculs financiers (avec Optional pour gérer les null)
        stats.setAveragePremium(insurancePolicyRepository.getAveragePremium().orElse(0.0));
        stats.setTotalPremiumCollected(insurancePolicyRepository.getTotalPremium().orElse(0.0));

        // Statistiques par type
        stats.setTypeStatistics(this.getInsuranceTypeStatistics());

        return stats;
    }
    // Statistiques par statut (pour pie chart)
    public Map<String, Long> getStatusDistribution() {
        return insurancePolicyRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        InsurancePolicy::getStatus,
                        Collectors.counting()
                ));
    }

    // Évolution mensuelle (pour line chart)
    public Map<String, Long> getMonthlyTrend() {
        return insurancePolicyRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        policy -> policy.getSubscription_date().getMonth().toString(),
                        Collectors.counting()
                ));
    }

    // Top 5 clients (pour tableaux)
    public Map<String, Double> getTopClientsByPremium() {
        return insurancePolicyRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        policy -> policy.getUser().getFirstName(),
                        Collectors.summingDouble(InsurancePolicy::getPremium)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }



    @Override
    public InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, int userId) {
        User user = userRepository.findById((long) userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        insurancePolicy.setUser(user);
        insurancePolicy.setStatus("INACTIVE"); // statut par défaut

        // Étape 1 : sauvegarde initiale pour générer l'ID
        InsurancePolicy savedPolicy = insurancePolicyRepository.save(insurancePolicy);

        // Étape 2 : calcul de la prime
        double premium = geminiService.calculatePremium(savedPolicy.getId()) * 1000;

        // Étape 3 : calcul de la franchise
        float deductible = calculateDeduct(premium, savedPolicy.getFrequency());

        // Mise à jour des valeurs calculées
        savedPolicy.setPremium(premium);
        savedPolicy.setDeductible(deductible);

        // Étape 4 : sauvegarde finale avec les champs mis à jour
        return insurancePolicyRepository.save(savedPolicy);
    }


    public float calculateDeduct(double premium, InsurancePolicy.PaymentFrequency frequency) {
        // Pourcentage de base selon la fréquence (plus la fréquence est élevée, plus la franchise est basse)
        float basePercentage;
        switch (frequency) {
            case ANNUAL:
                basePercentage = 0.30f; // 30% de la prime annuelle
                break;
            case SEMIANNUAL:
                basePercentage = 0.20f; // 20% de la prime semestrielle
                break;
            case QUARTERLY:
                basePercentage = 0.15f; // 15% de la prime trimestrielle
                break;
            case MONTHLY:
                basePercentage = 0.10f; // 10% de la prime mensuelle
                break;
            case WEEKLY:
                basePercentage = 0.05f; // 5% de la prime hebdomadaire
                break;
            default:
                basePercentage = 0.25f; // Valeur par défaut
        }

        // Calcul de la franchise de base
        float deductible = (float) (premium * basePercentage);

        // Facteur d'ajustement selon le type de prime (assurance)
        float typeFactor = 1.0f;
        if (premium > 2000) typeFactor = 1.2f; // Majoration pour hautes primes
        else if (premium < 500) typeFactor = 0.8f; // Réduction pour petites primes

        // Application du facteur avec limites min/max
        deductible = deductible * typeFactor;

        // Valeurs plancher et plafond
        float minDeductible = 50f; // Minimum absolu
        float maxDeductible = 2000f; // Maximum absolu

        return Math.max(minDeductible, Math.min(maxDeductible, deductible));
    }
    private float calculateDeductible(InsurancePolicy.PaymentFrequency frequency) {
        switch (frequency) {
            case ANNUAL:
                return 1000;
            case SEMIANNUAL:
                return 600;
            case QUARTERLY:
                return 300;
            case MONTHLY:
                return 100;
            default:
                return 0;
        }
    }
    public InsurancePolicy updateInsurancePolicy(InsurancePolicy updatedPolicy, int userId) {

        Optional<InsurancePolicy> existingPolicyOptional = insurancePolicyRepository.findById(updatedPolicy.getId());

        if (existingPolicyOptional.isEmpty()) {
            throw new EntityNotFoundException("InsurancePolicy not found with id: " + updatedPolicy.getId());
        }

        InsurancePolicy existingPolicy = existingPolicyOptional.get();

        User user = userRepository.findById((long) userId).orElse(null);

        if(user == null){
            return null; // ou lever une exception.
        }

        updatedPolicy.setUser(user);

        return insurancePolicyRepository.save(updatedPolicy);
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
    public List<InsurancePolicy> getPoliciesByUserId(int userId) {
        return insurancePolicyRepository.findByUser_UserId(userId);
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
        userInfo.add("Âge : " + policy.getUser().getDateOfBirth() + "\n");
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

    private double calculateDeductible(double premium) {
        double deductible = premium * 0.1;
        if (deductible < 50) {
            deductible = 50;
        } else if (deductible > 500) {
            deductible = 500;
        }
        return deductible;
    }

    public class SpecialDates {

        public static List<LocalDate> getSpecialDates() {
            return Arrays.asList(
                    LocalDate.of(2024, 3, 20), // Fête de l'Indépendance
                    LocalDate.of(2024, 4, 9),  // Fête des Martyrs
                    LocalDate.of(2024, 11, 29) // Black Friday (exemple)
                    // ... ajoutez d'autres dates
            );
        }}
    private void applySpecialDateDiscount(InsurancePolicy policy) {
        double discountPercentage = 0.10; // 10% de réduction (exemple)
        double discountedPremium = policy.getPremium() * (1 - discountPercentage);
        policy.setPremium(discountedPremium);
        insurancePolicyRepository.save(policy);
    }

    @Override
    public String checkSpecialDates(InsurancePolicy policy) { // Modification ici
        LocalDate subscriptionDate = policy.getSubscription_date().toLocalDate();
        List<LocalDate> specialDates = SpecialDates.getSpecialDates();

        for (LocalDate specialDate : specialDates) {
            if (subscriptionDate.equals(specialDate)) {
                String specialDateName = getSpecialDateName(specialDate);
                applySpecialDateDiscount(policy);
                String notificationText = sendSpecialDateNotification(policy, specialDateName);
                System.out.println("Notification : " + notificationText); // Vous pouvez laisser cette ligne pour le débogage
                return notificationText; // Retourner le texte de la notification
            }
        }
        return "Aucune notification trouvée"; // Retourner une chaîne par défaut si aucune notification n'est trouvée
    }

    @Override
    public byte[] generateContractPdfAsBytes(InsurancePolicy policy) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        pdf.addNewPage();

        // Copie exacte du code de generateContractPdfToDesktop()
        document.setBackgroundColor(new DeviceRgb(240, 240, 240));

        PdfFont timesRoman = PdfFontFactory.createFont(StandardFonts.TIMES_ROMAN);

        // Cadre
        PdfCanvas canvas = new PdfCanvas(pdf.getFirstPage());
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

        // Dates
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String formattedSubscriptionDate = policy.getSubscription_date().format(dateFormatter);
        String formattedExpirationDate = policy.getExpiration_date().format(dateFormatter);

        Paragraph DateParagraph = new Paragraph("Le contrat a commencé à ")
                .setFont(timesRoman)
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT);
        Paragraph subscriptionDateParagraph = new Paragraph(formattedSubscriptionDate)
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
        userInfo.add("Âge : " + policy.getUser().getDateOfBirth() + "\n");
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
        return outputStream.toByteArray();
    }

    private String sendSpecialDateNotification(InsurancePolicy policy, String specialDateName) {
        String notificationText = geminiService.generateTunisianNotification(policy, specialDateName);
        return notificationText; // Retour du texte
    }

    private String getSpecialDateName(LocalDate date) {
        // Implémentez la logique pour obtenir le nom de la date spéciale
        if (date.equals(LocalDate.of(2025, 3, 20))) {
            return "Fête de l'Indépendance";
        } else if (date.equals(LocalDate.of(2025, 4, 9))) {
            return "Fête des Martyrs";
        } else if (date.equals(LocalDate.of(2025, 11, 29))) {
            return "Black Friday";
        }
        return "Date Spéciale";
    }
    @Override
    public String applyOffers(int insuranceId) { // Modifier le type de retour à String
        InsurancePolicy policy = getInsurancePolicyById(insuranceId);
        double calculatedPremium = policy.getPremium();
        String offerDetails = ""; // Chaîne pour stocker les détails de l'offre

        if (calculatedPremium > 2000) {
            offerDetails += " - Offre: Paiement échelonné disponible.";
        }
        if (userHasMultiplePolicies((long) policy.getUser().getIdUser())) { // Conversion ici
            policy.setPremium(calculatedPremium * 0.95);
            offerDetails += " - Offre: 5% de réduction pour regroupement de polices.";
        }

        // Construire la chaîne de caractères avec les informations
        String result = "Contrat : " + policy.getInsurance_type() +
                "\nDate : " + policy.getSubscription_date() +
                "\nPrime originale : " + calculatedPremium +
                "\nPrime réduite : " + policy.getPremium() +
                "\nOffres : " + offerDetails;

        insurancePolicyRepository.save(policy);
        return result; // Renvoyer la chaîne de caractères
    }
    // Dans InsuranceService
    private boolean userHasMultiplePolicies(Long userId) { // Changer le type du paramètre en int
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return insurancePolicyRepository.findByUser_UserId(Math.toIntExact(userId)).size() > 1;

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


    @Override
    public List<InsurancePolicy> getInsurancePoliciesWithOffers() {
        List<InsurancePolicy> allPolicies = insurancePolicyRepository.findAll();
        List<InsurancePolicy> policiesWithOffers = new ArrayList<>();

        for (InsurancePolicy policy : allPolicies) {
            double calculatedPremium = policy.getPremium();

            // Vérifier si des offres sont applicables (mêmes conditions que dans applyOffers)
            if (calculatedPremium > 2000 || userHasMultiplePolicies((long) policy.getUser().getIdUser())) {
                policiesWithOffers.add(policy);
            }
        }

        return policiesWithOffers;
    }




}
