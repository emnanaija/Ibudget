package com.example.ibudgetproject.controllers.Investment;


import com.example.ibudgetproject.entities.Investment.Order;
import com.example.ibudgetproject.entities.Investment.PaymentOrder;
import com.example.ibudgetproject.entities.Investment.Wallet;
import com.example.ibudgetproject.entities.Investment.WalletInvesTransaction;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.example.ibudgetproject.services.Investment.OrderService;
import com.example.ibudgetproject.services.Investment.PaymentService;
import com.example.ibudgetproject.services.Investment.WalletService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
public class WalletController {
    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;
    @Autowired
    private UserRepository userRepository;
@Autowired
private PaymentService paymentService;

    @GetMapping("/api/wallet")
    public ResponseEntity<Wallet> getUserWallet(@RequestHeader("Authorization") String jwt) throws Exception {
        // Suppression de l'appel à userService.findUserProfileByJwt(jwt)
         User user = userService.findUserProfileByJwt(jwt);

        // Remplacer l'utilisateur par un utilisateur statique pour le test
        // Vous pouvez remplacer cet utilisateur par n'importe quel utilisateur de votre base de données
        //User user = userRepository.findByEmail("achrefghliss5@gmail.com").orElse(null);

        if (user == null){
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }

        Wallet wallet = walletService.getUserWallet(user);
        return new ResponseEntity<>(wallet, HttpStatus.ACCEPTED);
    }
    @PutMapping ("/api/wallet/{walletId}/transfer")
    public ResponseEntity<Wallet> WalletToWalletTransfer(@RequestHeader("Authorization") String jwt,
                                                         @PathVariable Long walletId,
                                                         @RequestBody WalletInvesTransaction req)
                                                         throws Exception{
        User senderUser = userService.findUserProfileByJwt(jwt);
        Wallet receiverWallet = walletService.findWalletById(walletId);
        Wallet wallet = walletService.WalletToWalletTransfer(senderUser,receiverWallet,req.getAmount());

    return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);
    }
    @PutMapping ("/api/wallet/order/{orderId}/pay")
    public ResponseEntity<Wallet>payOrderPayment(@RequestHeader("Authorization") String jwt,
                                                 @PathVariable Long orderId)
            throws Exception{
        User user = userService.findUserProfileByJwt(jwt);
        Order order = orderService.getOrderById(orderId);
        Wallet wallet=walletService.payOrderPayment(order,user);

        return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);
    }

    @PutMapping ("/api/wallet/order/deposit")
    public ResponseEntity<Wallet>addMoneyToWallet(@RequestHeader("Authorization") String jwt,
                                                 @RequestParam(name = "order_id") Long orderId,
                                                  @RequestParam(name = "payment_id") String paymentId)

            throws Exception{
        User user = userService.findUserProfileByJwt(jwt);

        Wallet wallet=walletService.getUserWallet(user);

        PaymentOrder order=paymentService.getPaymentOrderById(orderId);

        Boolean status=paymentService.ProceedPaymentOrder(order,paymentId);

        if (wallet.getBalance()==null){
            wallet.setBalance(BigDecimal.valueOf(0));
        }
       if (status){
           wallet=walletService.addBalance(wallet,order.getAmount());
       }



        return new ResponseEntity<>(wallet,HttpStatus.ACCEPTED);
    }



}

