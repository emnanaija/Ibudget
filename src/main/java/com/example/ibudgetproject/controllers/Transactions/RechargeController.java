package com.example.ibudgetproject.controllers.Transactions;


import com.example.ibudgetproject.entities.Transactions.RechargeCard;
import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.services.Transactions.Interfaces.IRechargeCardService;
import com.example.ibudgetproject.services.Transactions.RechargeCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/recharge")
public class RechargeController {

    @Autowired
    private IRechargeCardService rechargeCardService;
    @Autowired
    private RechargeCardService rechargeCardServicee;

    @PostMapping("/{simCardId}")
    public ResponseEntity<SimCardAccount> rechargeAccount(
            @PathVariable Long simCardId,
            @RequestParam String rechargeCode) {
        SimCardAccount updatedAccount = rechargeCardService.rechargeAccount(simCardId, rechargeCode);
        return ResponseEntity.ok(updatedAccount);
    }
    @PostMapping("/generate")
    public ResponseEntity<List<RechargeCard>> generateRechargeCards(
            @RequestParam int numberOfCards,
            @RequestParam double amount) {
        List<RechargeCard> rechargeCards = rechargeCardServicee.generateRechargeCards(numberOfCards, amount);
        return ResponseEntity.ok(rechargeCards);
    }


    //tw

    @PostMapping("/ocr/{simCardId}")
    public ResponseEntity<SimCardAccount> rechargeAccountWithImage(
            @PathVariable Long simCardId,
            @RequestParam("image") MultipartFile image) throws IOException {
        // Save the uploaded image to a temporary file
        String imagePath = saveUploadedImage(image);

        // Recharge the account using the scanned image
        SimCardAccount updatedAccount = rechargeCardService.rechargeAccountWithImage(simCardId, imagePath);

        // Delete the temporary file
        Files.deleteIfExists(Paths.get(imagePath));

        return ResponseEntity.ok(updatedAccount);
    }
    private String saveUploadedImage(MultipartFile image) throws IOException {
        String uploadDir = "uploads";
        Path uploadPath = Paths.get(uploadDir);

        // Create the upload directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save the file
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);

        return filePath.toString();
    }

    @PostMapping("/no-notification/{simCardId}")
    public ResponseEntity<SimCardAccount> rechargeAccountWithoutNotification(
            @PathVariable Long simCardId,
            @RequestParam String rechargeCode) {
        SimCardAccount updatedAccount = rechargeCardServicee.rechargeAccountWithoutNotification(simCardId, rechargeCode);
        return ResponseEntity.ok(updatedAccount);
    }
}