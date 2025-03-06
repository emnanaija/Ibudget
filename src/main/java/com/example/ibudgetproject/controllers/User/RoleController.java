package com.example.ibudgetproject.controllers.User;

import com.example.ibudgetproject.dto.User.RoleRequest;
import com.example.ibudgetproject.dto.User.UpdateRoleRequest;
import com.example.ibudgetproject.entities.User.Role;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.User.IRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/role")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {
    @Autowired
    private IRoleService service;

    @PostMapping("/addRole")
    public ResponseEntity<?> add(@RequestBody RoleRequest request) {
        try {
            service.add(request.getRoleName());
            return ResponseEntity.status(HttpStatus.CREATED).body("Role added with success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/deleteRole/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.CREATED).body("Role deleted with success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/allRoles")
    public ResponseEntity<?> getAllRole() {
        try {
            List<Role> roles = service.getAll();
            return ResponseEntity.ok(roles);
        } catch (RuntimeException e) {
            return ResponseEntity.status(NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getRole/{id}")
    public ResponseEntity<?> getRole(@PathVariable Long id) {
        try {
            Role role= service.get(id);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PatchMapping("/updateRole")
    public ResponseEntity<?> update(@RequestBody UpdateRoleRequest request) {
        try {
            service.UpdateRole(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("Role updated with success");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
