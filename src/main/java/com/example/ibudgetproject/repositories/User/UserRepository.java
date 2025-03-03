package com.example.ibudgetproject.repositories.User;

import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);  // Find user by ID

    Optional<User> findByFirstName(String firstName);  // Find user by username (optional)

}
