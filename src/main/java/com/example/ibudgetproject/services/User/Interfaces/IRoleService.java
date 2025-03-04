package com.example.ibudgetproject.services.User.Interfaces;

import com.example.ibudgetproject.DTO.User.UpdateRoleRequest;
import com.example.ibudgetproject.entities.User.Role;

import java.util.List;

public interface IRoleService {
    void add (String roleName) throws Exception;
    void delete(Long id) throws Exception;
    Role get(Long id) throws Exception;
    List<Role> getAll();
    void UpdateRole(UpdateRoleRequest request) throws Exception;
}
