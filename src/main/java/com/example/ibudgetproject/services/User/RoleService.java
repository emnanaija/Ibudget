package com.example.ibudgetproject.services.User;

import com.example.ibudgetproject.DTO.User.UpdateRoleRequest;
import com.example.ibudgetproject.entities.User.Role;
import com.example.ibudgetproject.repositories.User.RoleRepository;
import com.example.ibudgetproject.services.User.Interfaces.IRoleService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleService implements IRoleService {
    @Autowired
    private RoleRepository repository;

    public void add (String roleName) throws Exception {
        Optional<Role> optionalRole = repository.findByName(roleName);
        if(optionalRole.isPresent())
        {
            throw new Exception("Role already exists");
        }
        try{
        var role=Role.builder()
                .name(roleName)
                .build();

        repository.save(role);
        }catch (Exception e)
        {
            throw  new Exception("Failed to add role");
        }
    }
    public void delete(Long id) throws Exception {
        Optional<Role> optionalRole = repository.findById(id);
        if(!optionalRole.isPresent())
        {
            throw new Exception("Role doesn't exist");
        }
        try {
            repository.deleteById(id);
        }catch (Exception e)
        {
            throw new Exception("Role couldn't be deleted");
        }
    }
    public Role get(Long id) throws Exception {
        Optional<Role> optionalRole = repository.findById(id);
        if (!optionalRole.isPresent()) {
            throw new Exception("Role doesn't exist");
        }
        try {
            return repository.getById(id);
        } catch (Exception e) {
            throw new Exception("Couldn't get role");
        }
    }

    public List<Role> getAll(){
        return repository.findAll();
    }
    public void UpdateRole(UpdateRoleRequest request) throws Exception {
        Optional<Role> optionalRole = repository.findById(request.getId());
        if(!optionalRole.isPresent())
        {
            throw new Exception("Role doesn't exist");
        }
        try {
            Role role=optionalRole.get();
            role.setName(request.getRoleName());
            repository.save(role);
        }catch (Exception e)
        {
            throw new Exception("Role couldn't be updated");
        }
    }
}
