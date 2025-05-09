package com.example.ibudgetproject.security;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.http.HttpHeaders;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    public UserDetailsService userDetailsService;
    @Autowired
    private OAuth2AuthenticationHandler oauth2Handler;

    @Autowired
    private JWtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {



        http    .cors(Customizer.withDefaults())
                .csrf(cs -> cs.disable())
                .authorizeHttpRequests((req -> req
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**","/user/1", "user/register", "user/login", "user/activateAccount", "user/resendActivationCode"
                                ,"user/completeProfile", "user/sendResetEmail"
                                ,"user/refreshToken"
                                ,"user/deleteUserByAdmin","user/getDeletionRequestsAdmin","user/getUpdateRequestsAdmin","user/getAllUsersByAdmin","user/resetPassword", "connexionInfo/approveLogIn", "/oauth2/**", "user/sendResetPasswordRequest","/transaction/**",
                                "/account/**","/payment/**","/api/bills/**","/recharge/**","/subscription/**","/coins/**","/api/wallet/**","/order/**","/api/payment/**","/api/depenses/**","/api/depenses-recurrentes/**","/api/categories/**","/api/fetes/**","/api/predictions/**","/api/wallets/**","/uploads/**","/compte-epargne/**","/depot/**","/objectif/**","/simulation/**","/taux-interet/**")
                        .permitAll()
                        .anyRequest().authenticated()))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                        })
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(oauth2Handler))
                .httpBasic(withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy((SessionCreationPolicy.STATELESS)))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ORIGIN,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT,
                HttpHeaders.AUTHORIZATION,
                "No-Auth"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "PATCH"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}