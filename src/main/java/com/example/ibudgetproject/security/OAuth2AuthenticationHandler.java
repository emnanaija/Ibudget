package com.example.ibudgetproject.security;

import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.User.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@Getter
@Setter
public class OAuth2AuthenticationHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String userEmail = oauth2User.getAttribute("email");
        Optional<User> optionalUser=userRepository.findByEmail(userEmail);
        if (!optionalUser.isPresent()) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("You need to register first to IBudget, to do so you have to provide the following informations in order to complete the registration");
            //Je vais donner le profile completion link after working on the backend o el email yedakhel toul
            //String redirectLink="http://localhost:8090/user/completeProfile?email="+userEmail
            //response.sendRedirect(redirectLink)
        }else{
            response.setStatus(HttpServletResponse.SC_OK);
            response.sendRedirect("https://www.google.com/");
        }

    }

    }

