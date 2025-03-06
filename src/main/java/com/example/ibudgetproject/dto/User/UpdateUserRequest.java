package com.example.ibudgetproject.dto.User;

import com.example.ibudgetproject.entities.User.FinancialKnowledgeLevel;
import com.example.ibudgetproject.entities.User.Gender;
import com.example.ibudgetproject.entities.User.Tone;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateUserRequest {

    @Email(message = "Email is not well formatted")
    private String email;

    private String profession;

    @Pattern(
            regexp = "^\\+216\\d{8}$",
            message = "Invalid Tunisian phone number. It should be in the format +216XXXXXXXX"
    )
    private  String phoneNumber;

    private Tone aiTonePreference;

    private FinancialKnowledgeLevel financialKnowledgeLevel;

    @NotEmpty(message = "Password is mandatory")
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 10, message = "Password should be 10 characters long minimum")
    private String currentPassword;


}
