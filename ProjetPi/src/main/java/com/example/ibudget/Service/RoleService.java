package com.example.ibudget.Service;

import com.example.ibudget.Entity.Role;
import com.example.ibudget.Repository.RoleRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoleService implements IRoleService{
    @Autowired
    private RoleRepository repository;
    public Role add (Role role){
        return repository.save(role);
    }
    public void delete(int id){
        repository.deleteById(id);
    }
    public Role get(int id){
        return repository.getById(id);
    }
    public List<Role> getAll(){
        return repository.findAll();
    }
}
