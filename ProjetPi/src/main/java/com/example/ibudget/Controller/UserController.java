package com.example.ibudget.Controller;

import com.example.ibudget.Entity.User;
import com.example.ibudget.Service.UserService;
import com.example.ibudget.auth.*;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService service;

    @GetMapping("/hello")
    public ResponseEntity sayHello(){
        return ResponseEntity.ok("hello");
    }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) throws MessagingException {
        try {
            service.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Registered with success");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) throws MessagingException {
        try {
            AuthenticationResponse response = service.authenticate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        }

    @PostMapping("/refreshToken")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }



    @PostMapping("/activateAccount")
    public ResponseEntity<?> confirm(@RequestBody @Valid ActivationRequest activationRequest
    ) {
        try {
            service.activateAccount(activationRequest);
            return ResponseEntity.ok("Account activated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

        @PostMapping("/resendActivationCode")
        public ResponseEntity<?> resendVerificationCode (@RequestParam String email)
        {
            try {
                service.resendActivationCode(email);
                return ResponseEntity.ok("Activation code sent");
            } catch (RuntimeException | MessagingException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestBody @Valid
            ChangePasswordRequest request,
            @AuthenticationPrincipal User connectedUser
    ) {
        try {
            service.changePassword(request, connectedUser);
            return ResponseEntity.ok("Password changed successfully");
        }catch(IllegalStateException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sendResetPasswordEmail")
    public ResponseEntity<String> sendResetEmail(@RequestParam String email) {
        try {
            service.sendPasswordResetEmail(email);
            return ResponseEntity.ok("Password reset link sent to email");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam @Valid ResetPasswordRequest newPassword) {
        try {
            service.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password has been successfully reset");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/getUserByAdmin/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            User user = service.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/getAllUsersByAdmin")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = service.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (RuntimeException e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/accountDeletionRequest")
    public ResponseEntity<String> requestDeleteAccount(@AuthenticationPrincipal User connectedUser  , @RequestBody String password) {
        if (!service.verifyPassword(connectedUser.getEmail(),password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password does not match.");
        }
        boolean isRequested = service.requestDeleteAccount(connectedUser.getEmail());
        if (isRequested) {
            return ResponseEntity.ok("Account deletion requested.Your account will be permanently deleted soon till then you can restore access");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account deletion request Failed");
        }
    }

    @DeleteMapping("/deleteUserByAdmin/{userId}")
    public ResponseEntity<String> deleteUserByAdmin(@PathVariable Long userId) {
        boolean isDeleted = service.deleteUserByAdmin(userId);
        if (isDeleted) {
            return ResponseEntity.ok("User account deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found or unable to delete.");
        }
    }

    @GetMapping("/getDeletionRequestsAdmin")
    public ResponseEntity<?> getDeletionRequests() {
        try {
        List<User> users = service.getUsersRequestedDeletion();
        return ResponseEntity.ok(users);
        }catch(Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());}
    }


    }

