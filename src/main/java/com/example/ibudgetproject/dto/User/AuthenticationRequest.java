package com.example.ibudgetproject.dto.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {

    @Email(message = "Email is not well formatted")
    @NotEmpty(message = "Email is mandatory")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 10, message = "Password should be 10 characters long minimum")
    private String password;

}

