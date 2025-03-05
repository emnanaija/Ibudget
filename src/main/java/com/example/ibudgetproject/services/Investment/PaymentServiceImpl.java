package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.Response.PaymentResponse;
import com.example.ibudgetproject.entities.Investment.PaymentOrder;
import com.example.ibudgetproject.entities.Investment.domain.PaymentMethod;
import com.example.ibudgetproject.entities.Investment.domain.PaymentOrderStatus;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Investment.PaymentServiceRepository;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
   @Autowired
    private PaymentServiceRepository paymentServiceRepository;
       @Value("${stripe.api.key}")
       private String stripeSecretKey;

    @Value("${razorpay.api.key}")
    private String RazorApiKey;

    @Value("${razorpay.api.secret}")
    private String RazorApiSecretKey;
    @Override
    public PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod) {
       PaymentOrder paymentOrder=new PaymentOrder();
       paymentOrder.setUser(user);
       paymentOrder.setAmount(amount);
       paymentOrder.setPaymentMethod(paymentMethod);
       paymentOrder.setStatus(PaymentOrderStatus.PENDING);


        return paymentServiceRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentServiceRepository.findById(id).orElseThrow(()->new Exception("payment order not found"));
    }

    @Override
    public Boolean ProceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException {
       if (paymentOrder.getStatus()==null){
           paymentOrder.setStatus(PaymentOrderStatus.PENDING);
       }
        if (paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)){
            if (paymentOrder.getPaymentMethod().equals(PaymentMethod.RAZORPAY)){
                RazorpayClient razorpay=new RazorpayClient(RazorApiKey,RazorApiSecretKey);
                Payment payment=razorpay.payments.fetch(paymentId);

                Integer amount=payment.get("amount");
                String status=payment.get("status");

                if (status.equals("captured")){
                    paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
                    return true;
                }
                paymentOrder.setStatus(PaymentOrderStatus.FAILED);
                paymentServiceRepository.save(paymentOrder);
                return false;
            }
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentServiceRepository.save(paymentOrder);
            return true;
        }

        return false;
    }

    @Override
    public PaymentResponse createRazorpayPaymentLink(User user, Long amount) throws RazorpayException {
        Long Amount= amount*100;
        try{
            RazorpayClient razorpay=new RazorpayClient(RazorApiKey,RazorApiSecretKey);

            JSONObject paymentLinkRrquest= new JSONObject();
            paymentLinkRrquest.put("amount", amount);
            paymentLinkRrquest.put("currency","INR");

            JSONObject customer= new JSONObject();
            customer.put("name",user.getUsername());

            customer.put("email",user.getEmail());
            paymentLinkRrquest.put("customer",customer);

            //Create a JSON object with the notification settings
            JSONObject notify= new JSONObject();
            notify.put("email",true);
            paymentLinkRrquest.put("notify",notify);


            //set the reminder setting
            paymentLinkRrquest.put("reminder_enable",true);

            //set the callback url and method
            paymentLinkRrquest.put("callback_url","http://localhost:8082/wallet");
            paymentLinkRrquest.put("callback_method","get");

            PaymentLink payment=razorpay.paymentLink.create(paymentLinkRrquest);
            String paymentLinkId=payment.get("id");
            String paymentLinkURL=payment.get("short_url");

            PaymentResponse res=new PaymentResponse();
            res.setPayment_url(paymentLinkURL);

            return res;

        }catch (RazorpayException e){
            System.out.println("Error creating payment link: " + e.getMessage());
            throw new RazorpayException(e.getMessage());
        }
    }

    @Override
    public PaymentResponse createStripePaymentLink(User user, Long amount, Long orderId) throws StripeException {
        Stripe.apiKey=stripeSecretKey;

        SessionCreateParams params=SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8082/wallet?order_id="+ orderId)
                .setCancelUrl("http://localhost:8082/payment/cancel")
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("usd")
                                .setUnitAmount(amount*100)
                                .setProductData(SessionCreateParams
                                        .LineItem
                                        .PriceData
                                        .ProductData
                                        .builder()
                                        .setName("Top up wallet")
                                        .build()
                                ).build()
                        ).build()
                ).build();

        Session session= Session.create(params);

        System.out.println("session __________" + session);
        PaymentResponse res= new PaymentResponse();
        res.setPayment_url(session.getUrl());
        return res;
    }
}
