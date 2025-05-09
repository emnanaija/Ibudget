package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.User;

import java.util.List;

public interface IUserService {

    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
