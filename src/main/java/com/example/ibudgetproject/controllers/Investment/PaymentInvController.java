package com.example.ibudgetproject.controllers.Investment;

import com.example.ibudgetproject.Response.PaymentResponse;
import com.example.ibudgetproject.entities.Investment.PaymentOrder;
import com.example.ibudgetproject.entities.Investment.domain.PaymentMethod;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.Investment.PaymentService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentInvController {
    @Autowired
    private UserService userService;
    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws Exception {


        User user = userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;
        PaymentOrder order=paymentService.createOrder(user,amount,paymentMethod);

        if (paymentMethod.equals(PaymentMethod.RAZORPAY)){
            paymentResponse=paymentService.createRazorpayPaymentLink(user,amount);
        }else {
              paymentResponse=paymentService.createStripePaymentLink(user,amount, order.getPayOrderId());
        }

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }

}
