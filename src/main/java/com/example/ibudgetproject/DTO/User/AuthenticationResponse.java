package com.example.ibudgetproject.DTO.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {

    private String accessToken;
    private String refreshToken;
    private String role;
    private String email;
    private Long id;
}