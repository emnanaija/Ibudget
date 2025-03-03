package com.example.ibudgetproject.DTO.User;

import com.example.ibudgetproject.entities.User.FinancialKnowledgeLevel;
import com.example.ibudgetproject.entities.User.Gender;
import com.example.ibudgetproject.entities.User.Tone;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class RegisterRequest {


        @NotEmpty(message = "Firstname is mandatory")
        @NotBlank(message = "Firstname cannot be blank")
        private String firstName;

        @NotEmpty(message = "Lastname is mandatory")
        @NotBlank(message = "Lastname cannot be blank")
        private String lastName;

        @Email(message = "Email is not well formatted")
        @NotEmpty(message = "Email is mandatory")
        @NotBlank(message = "Email cannot be blank")
        private String email;

        @NotEmpty(message = "Password is mandatory")
        @NotBlank(message = "Password cannot be blank")
        @Size(min = 10, message = "Password should be 10 characters long minimum")
        private String password;



        @NotNull(message = "Gender is mandatory")
        private Gender gender;
        @NotNull(message = "Gender is mandatory")
        private Tone aiTonePreference;
        @NotNull(message = "Gender is mandatory")
    private FinancialKnowledgeLevel financialKnowledgeLevel;
    @NotEmpty(message = "Profession is mandatory")
    private String profession;


    @NotNull(message = "Date of birth is mandatory")
    @Past(message = "Date of birth must be in the past")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth;

    @NotNull(message = "Phone number cannot be null")
    @Pattern(
            regexp = "^\\+216\\d{8}$",
            message = "Invalid Tunisian phone number. It should be in the format +216XXXXXXXX"
    )
    private  String phoneNumber;


}
