package com.example.ibudgetproject.controllers.Investment;


import com.example.ibudgetproject.entities.Investment.Wallet;
import com.example.ibudgetproject.entities.Investment.Withdrawal;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.Investment.WalletService;
import com.example.ibudgetproject.services.Investment.WithdrawalService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WithdrawalController {

    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @Autowired
    private WithdrawalService withdrawalService;

   @PostMapping("/api/withdrawal/{amount}")
    public ResponseEntity<?> withdrawalRequest(
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws Exception {

       User user = userService.findUserProfileByJwt(jwt);
       Wallet userWallet = walletService.getUserWallet(user);

       Withdrawal withdrawal = withdrawalService.requestWithdrawal(amount, user);
       walletService.addBalance(userWallet, -withdrawal.getAmount());

       return new ResponseEntity<>(withdrawal, HttpStatus.OK);
   }


    @PostMapping("/api/admin/withdrawal/{id}/proceed/{accept}")
    public ResponseEntity<?> proceedwithdrawal(@PathVariable Long id,@PathVariable Boolean accept, @RequestHeader("Authorization") String jwt) throws Exception{
        User user = userService.findUserProfileByJwt(jwt);
        Withdrawal withdrawal=withdrawalService.proceedWithWithdrawal(id,accept);

        Wallet userWallet=walletService.getUserWallet(user);
        if (!accept){
            walletService.addBalance(userWallet,withdrawal.getAmount());
        }
        return new ResponseEntity<>(withdrawal, HttpStatus.OK);
    }

@GetMapping("/api/withdrawal")
    public ResponseEntity<List<Withdrawal>> getWithdrawalHistory(
            @RequestHeader("Authorization")String jwt) throws Exception {
    User user = userService.findUserProfileByJwt(jwt);

    List<Withdrawal> withdrawals = withdrawalService.getUsersWithdrawalHistory(user);
    return new ResponseEntity<>(withdrawals, HttpStatus.OK);
}
    @GetMapping("/api/admin/withdrawal")
    public ResponseEntity<List<Withdrawal>> getAllWithdrawalRequest(
            @RequestHeader("Authorization")String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        List<Withdrawal> withdrawals = withdrawalService.getAllWithdrawalRequest();
        return new ResponseEntity<>(withdrawals, HttpStatus.OK);
    }



}
