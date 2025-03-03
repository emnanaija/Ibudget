package com.example.ibudgetproject.DTO.User;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailValidationResponse {
    @JsonProperty("email")
    private String email;

    @JsonProperty("deliverability")
    private String deliverability;

    @JsonProperty("quality_score")
    private double qualityScore;

    @JsonProperty("is_valid_format")
    private NestedBoolean validFormat;

    @JsonProperty("is_mx_found")
    private NestedBoolean mxFound;

    @JsonProperty("is_smtp_valid")
    private NestedBoolean smtpValid;

    @JsonProperty("is_disposable_email")
    private NestedBoolean disposableEmail;

    @Data
    public static class NestedBoolean {
        private boolean value;
    }
}
