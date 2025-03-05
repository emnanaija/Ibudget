package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.Response.PaymentResponse;
import com.example.ibudgetproject.entities.Investment.PaymentOrder;
import com.example.ibudgetproject.entities.Investment.domain.PaymentMethod;
import com.example.ibudgetproject.entities.User.User;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;

public interface PaymentService {
    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);
    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean ProceedPaymentOrder(PaymentOrder paymentOrder,String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount) throws RazorpayException;

    PaymentResponse createStripePaymentLink(User user, Long amount,Long orderId) throws StripeException;


}
