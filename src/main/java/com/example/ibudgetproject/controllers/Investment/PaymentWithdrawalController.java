package com.example.ibudgetproject.controllers.Investment;

import com.example.ibudgetproject.entities.Investment.PaymentWithdrawal;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.Investment.PaymentWithdrawalService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class PaymentWithdrawalController {

    @Autowired
    private UserService userService;
    @Autowired
    private PaymentWithdrawalService paymentWithdrawalService;


    @PostMapping("/paymentWithdrawal-Details")
    public ResponseEntity<PaymentWithdrawal> addPaymentWithdrwal(@RequestBody PaymentWithdrawal paymentWithdrawalRequest,
                                                                 @RequestHeader("Authorization") String token) throws Exception {

        User user = userService.findUserProfileByJwt(token);

        PaymentWithdrawal paymentWithdrawal = paymentWithdrawalService.addPaymentWithdrawalDetails(
                paymentWithdrawalRequest.getAccountNumber(),
                paymentWithdrawalRequest.getHolderNameAccount(),
                paymentWithdrawalRequest.getFcs(),
                paymentWithdrawalRequest.getBankName(),
                user
        );
        return new ResponseEntity<>(paymentWithdrawal, HttpStatus.CREATED);
    }

    @GetMapping("/paymentWithdrawal-Details")
    public ResponseEntity<PaymentWithdrawal> getUsersPaymentWithdrawal(@RequestHeader("Authorization") String token) throws Exception
    { User user = userService.findUserProfileByJwt(token);

        PaymentWithdrawal paymentWithdrawal=paymentWithdrawalService.getUsersPaymentWithdrawalDetails(user);
        return new ResponseEntity<>(paymentWithdrawal, HttpStatus.CREATED);

    }



}
