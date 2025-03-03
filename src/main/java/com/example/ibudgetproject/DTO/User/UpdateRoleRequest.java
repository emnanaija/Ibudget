package com.example.ibudgetproject.DTO.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoleRequest {
    @NotBlank(message = "Role id cannot be blank")
    Long id;
    @NotBlank(message = "Role name cannot be blank")
    String roleName;
}
