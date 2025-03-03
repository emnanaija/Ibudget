package com.example.ibudgetproject.services.User.Interfaces;

import com.example.ibudgetproject.DTO.User.*;
import com.example.ibudgetproject.entities.User.User;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface IUserService {
    User getUserById(Long userId);
    List<User> getAllUsers();
    boolean deleteUsersByAdmin();
    boolean requestDeleteAccount(String email);
    List<User> getUsersRequestedDeletion();
    void updateUser(User connectedUser, UpdateUserRequest userDetails) throws Exception;

    boolean isEmailValid(String email);
    void register(RegisterRequest request , HttpServletRequest req) throws Exception;
    void activateAccount(ActivationRequest activationRequest);
    void resendActivationCode(String email) throws MessagingException;
    AuthenticationResponse authenticate(AuthenticationRequest request , HttpServletRequest req) throws Exception;
    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
    void changePassword(ChangePasswordRequest request, User user);
    void resetPassword(String token, ResetPasswordRequest request) throws Exception;
    boolean verifyPassword(String email, String password);
    String generateActivationCode();
    void sendActivationEmail(User user) throws MessagingException;
    void sendAccountBlockedAlertEmail(User user) throws MessagingException;
    void sendRestoreAccountAccessEmail(User user) throws MessagingException;
    void sendPasswordResetEmail(String email) throws Exception;

    void completProfile(CompleteProfileRequest request, HttpServletRequest req, String email) throws Exception;

    List<User> getUsersRequestedUpdate();

    boolean updateUserByAdmin(Long id);

    boolean requestUpdateAccount(String email,UpdateUserByAdminRequest request);
}
