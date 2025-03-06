package com.example.ibudgetproject.dto.User;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationResponse {

    private String accessToken;
    private String refreshToken;
}
