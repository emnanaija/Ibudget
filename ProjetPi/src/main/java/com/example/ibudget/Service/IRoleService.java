package com.example.ibudget.Service;

import com.example.ibudget.Entity.Role;

import java.util.List;

public interface IRoleService {
    public Role add (Role role);
    public void delete(int id);
    public Role get(int id);
    public List<Role> getAll();
}
