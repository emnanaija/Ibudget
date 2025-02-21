package com.example.ibudget.Service;

import com.example.ibudget.Entity.TypeAccount;
import com.example.ibudget.Entity.User;
import com.example.ibudget.Repository.RoleRepository;
import com.example.ibudget.Repository.UserRepository;
import com.example.ibudget.Security.JWTService;
import com.example.ibudget.Utility.EncryptionUtility;
import com.example.ibudget.auth.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private EmailService emailService;

    private EncryptionUtility encryptor = new EncryptionUtility();

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private static final long TOKEN_EXPIRATION_MINUTES = 5;

    //*****************CRUD****************

    //**Get User**
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    //**Delete User**
    public boolean requestDeleteAccount(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setDeletionRequested(true);
            user.setAccountLocked(true);
            user.setAccountEnabled(false);
            userRepository.save(user);
            return true;
        }
        return false;

    }

    public boolean verifyPassword(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            String storedPassword = optionalUser.get().getPassword();
            return encoder.matches(password, storedPassword);
        }
        return false;
    }
    public List<User> getUsersRequestedDeletion() {
        return userRepository.findByDeletionRequestedTrue();
    }

    public boolean deleteUserByAdmin(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
            return true;
        }
        return false;

    }



    public void register(RegisterRequest request) throws MessagingException {
        String code = generateActivationCode();
        var userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .gender(request.getGender())
                .profession(request.getProfession())
                .dateOfBirth(request.getDateOfBirth())
                .phoneNumber(request.getPhoneNumber())
                .accountLocked(false)
                .accountEnabled(false)
                .deletionRequested(false)
                .role(userRole)
                .activationCode(code)
                .activationCodeExpiry(LocalDateTime.now().plusMinutes(15))  // With time zone offset
                .accountType(TypeAccount.Fremium)
                .build();

        userRepository.save(user);
        sendActivationEmail(user);
    }

    private void sendActivationEmail(User user) throws MessagingException {
        String activationCode = user.getActivationCode();

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationCode,
                "Account Activation"
        );

    }

    private String generateActivationCode() {

        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < 6; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        String activationCode = codeBuilder.toString();

        return activationCode;

    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = optionalUser.get();

        if (!user.isAccountNonLocked()) {
            sendAccountBlockedAlertEmail(user);
            throw new Exception("Your account is locked due to multiple failed login attempts");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            if (authentication.isAuthenticated()) {
                user.setFailedAttempts(0);
                userRepository.save(user);
                // return jwtService.generateToken(request.getEmail())+"//"+jwtService.generateRefreshToken(request.getEmail());
                return AuthenticationResponse.builder()
                        .accessToken(jwtService.generateToken(request.getEmail()))
                        .refreshToken(jwtService.generateRefreshToken(request.getEmail()))
                        .build();
            }

        } catch (Exception e) {
            user.setFailedAttempts(user.getFailedAttempts() + 1);
            if (user.getFailedAttempts() == 3) {
                user.setAccountLocked(true);
                user.setAccountEnabled(false);
            }

            userRepository.save(user);
            throw new Exception("Login failed " + (3 - user.getFailedAttempts()) + " attempts remaining");

        }

        throw new BadCredentialsException("Invalid credentials");
    }

    private void sendAccountBlockedAlertEmail(User user) throws MessagingException {
        String activationCode = user.getActivationCode();

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ALERT_BLOCKED_ACCOUNT,
                null,
                "Alert : Account Blocked"
        );

    }

    private void sendRestoreAccountAccessEmail(User user) throws MessagingException {
        String activationCode = user.getActivationCode();

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.RESTORE_ACCOUNT_ACCESS,
                activationCode,
                "Restore Account Access "
        );

    }

    public void activateAccount(ActivationRequest activationRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(activationRequest.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getActivationCodeExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (user.getActivationCode().equals(activationRequest.getActivationCode())) {
                user.setAccountEnabled(true);
                user.setActivationCode(null);
                user.setActivationCodeExpiry(null);
                if (user.getAccountLocked())
                    user.setAccountLocked(false);
                user.setFailedAttempts(0);
                userRepository.save(user);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void resendActivationCode(String email) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseThrow(() -> new RuntimeException("User not found:" + email));
        if (user.isEnabled()) {
            throw new RuntimeException("Account is already verified");
        }
        user.setActivationCode(generateActivationCode());
        user.setActivationCodeExpiry(LocalDateTime.now().plusHours(1));

        if (user.getAccountLocked()) {
            sendRestoreAccountAccessEmail(user);
        } else {
            sendActivationEmail(user);
        }
        userRepository.save(user);

    }

    public void changePassword(ChangePasswordRequest request, User user) {

        // check if the current password is correct
        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalStateException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalStateException("Password are not the same");
        }

        // update the password
        user.setPassword(encoder.encode(request.getNewPassword()));

        // save the new password
        userRepository.save(user);
    }

    public void sendPasswordResetEmail(String email) throws Exception {

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        User user = userOptional.get();


        long timestamp = Instant.now().getEpochSecond(); // Get current timestamp
        String tokenData = email + ":" + timestamp;


        // Encrypt the token
        String encryptedToken = encryptor.encrypt(tokenData);

        String resetLink = "http://localhost:8080/users/reset-password?token=" + encryptedToken;

        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.RESET_PASSWORD,
                resetLink,
                "Reset Password"
        );

    }

    public void resetPassword(String token, ResetPasswordRequest request) throws Exception {
        String decryptedData = encryptor.decrypt(token); // Decrypt token to get "email:timestamp"
        String[] parts = decryptedData.split(":");
        if (parts.length != 2) {
            throw new RuntimeException("Invalid token format");
        }

        String email = parts[0];
        long timestamp = Long.parseLong(parts[1]);

        long currentTime = Instant.now().getEpochSecond();
        long timeDifference = Duration.between(Instant.ofEpochSecond(timestamp), Instant.ofEpochSecond(currentTime)).toMinutes();

        if (timeDifference > TOKEN_EXPIRATION_MINUTES) {
            throw new RuntimeException("Token expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }



    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUserName(refreshToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.validateToken(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user.getEmail());
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }



}

