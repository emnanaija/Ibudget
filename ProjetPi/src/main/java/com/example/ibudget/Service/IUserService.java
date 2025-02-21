package com.example.ibudget.Service;

import com.example.ibudget.Entity.User;
import com.example.ibudget.auth.RegisterRequest;
import jakarta.mail.MessagingException;

public interface IUserService {
    public void register(RegisterRequest request) throws MessagingException;
    public void delete(Long id);
}
