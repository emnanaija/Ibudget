package com.example.ibudgetproject.controllers.User;

import com.example.ibudgetproject.dto.User.*;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.User.ChatService;
import com.example.ibudgetproject.services.User.IUserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private IUserService service;
    @Autowired
    private ChatService chatService;
   @PostMapping("/completeProfile")
   public ResponseEntity<?> completeProfile(@RequestBody @Valid CompleteProfileRequest request, HttpServletRequest req,@RequestParam String email ) throws MessagingException {
       try {
           service.completProfile(request,req,email);
           return ResponseEntity.status(HttpStatus.CREATED).body("Registered with success");
       } catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
   }


    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request, HttpServletRequest req) throws MessagingException {
        try {
            service.register(request,req);
            return ResponseEntity.status(HttpStatus.CREATED).body("Registered with success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request, HttpServletRequest req) throws MessagingException {
        try {
            AuthenticationResponse response = service.authenticate(request,req);
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
@PutMapping("/updateUser")
     public ResponseEntity<?> updateUser(@AuthenticationPrincipal User connectedUser
        ,@RequestBody UpdateUserRequest userDetails)
{
    try {
        service.updateUser(connectedUser,userDetails);
        return ResponseEntity.ok("Information updated with success");
    } catch (Exception e) {
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
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestBody @Valid ResetPasswordRequest newPassword) {
        try {
            service.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password has been successfully reset");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getUserByAdmin/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            User user = service.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ADMIN')")
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

    @DeleteMapping("/deleteUserByAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUserByAdmin() {
        boolean isDeleted = service.deleteUsersByAdmin();
        if (isDeleted) {
            return ResponseEntity.ok("Deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Deletion failed.");
        }
    }

    @GetMapping("/getDeletionRequestsAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDeletionRequests() {
        try {
        List<User> users = service.getUsersRequestedDeletion();
        return ResponseEntity.ok(users);
        }catch(Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());}
    }



   //**** Update first/last name and date of birth
    @PostMapping("/sendUpdateRequest")
    public ResponseEntity<?> sendUpdateRequest(@AuthenticationPrincipal User connectedUser,@RequestBody UpdateUserByAdminRequest request) {

        if (!service.verifyPassword(connectedUser.getEmail(),request.getCurrentPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Password does not match.");
        }
        boolean isRequested = service.requestUpdateAccount(connectedUser.getEmail(),request);
        if (isRequested) {
            return ResponseEntity.ok("Account update request sent.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account update request Failed.");
        }
    }

    @GetMapping("/getUpdateRequestsAdmin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUpdateRequests() {
        try {
            List<User> users = service.getUsersRequestedUpdate();
            return ResponseEntity.ok(users);
        }catch(Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());}
    }

    @PostMapping("/updateUserByAdmin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateUserByAdmin(@PathVariable Long userId) {
        boolean isUpdated = service.updateUserByAdmin(userId);
        if (isUpdated) {
            return ResponseEntity.ok("User updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Couldn't update user , please check the id");
        }
    }
    //** chat
    @PostMapping("/advice")
    public ResponseEntity<String> getFinancialAdvice(@RequestBody ChatRequest request, @AuthenticationPrincipal User connectedUser) {
        try {
            String advice = chatService.generateFinancialAdvice(request.getQuestion(), connectedUser.getAiTonePreference(), connectedUser.getFinancialKnowledgeLevel());
            return ResponseEntity.ok(advice);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace(); // Log the exception properly in a real application
            return ResponseEntity.internalServerError().body("Error generating financial advice.");
        }

    }

    }

