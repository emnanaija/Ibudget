package com.example.ibudgetproject.controllers.Transactions;


import com.example.ibudgetproject.entities.Transactions.Payment;
import com.example.ibudgetproject.services.Transactions.Interfaces.IPaymentService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;


    @PostMapping("/pay-bill")
    public Payment payBill(@RequestParam Long billId, @RequestParam String paymentMethod,
                           @RequestParam String beneficiary, @RequestParam String comment) {
        return paymentService.payBill(billId, paymentMethod, beneficiary, comment);
    }
}
