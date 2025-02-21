package com.example.ibudgetproject.services.Transactions;


import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {
    public String extractTextFromImage(String imagePath) {
        Tesseract tesseract = new Tesseract();
        try {
            // path to tessract
            tesseract.setDatapath("C:/Program Files/Tesseract-OCR/tessdata");
            tesseract.setLanguage("eng");
            // use ocr to extract
            String result = tesseract.doOCR(new File(imagePath));
            //madem fama erreur nchouf l code eli yekhou fih ala terminal
            System.out.println("OCR result: " + result);
            return result;
        } catch (TesseractException e) {
            throw new RuntimeException("Error processing image with Tesseract: " + e.getMessage(), e);
        }
    }
}