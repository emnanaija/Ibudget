package com.example.ibudget.Controller;

import com.example.ibudget.Entity.Role;
import com.example.ibudget.Entity.User;
import com.example.ibudget.Service.RoleService;
import com.example.ibudget.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoleController {
    @Autowired
    private RoleService service;
    @PostMapping("/AddRole")
    public Role add(@RequestBody Role role){
        return service.add(role);
    }
    @DeleteMapping("/DeleteRole/{id}")
    public void delete(@PathVariable int id){
        service.delete(id);
    }

    @GetMapping("/allRoles")
    public List<Role> getAllRole(){
        return service.getAll();
    }

    @GetMapping("/Role/{id}")
    public Role getRole(@PathVariable int id){
        return service.get(id);
    }

}
