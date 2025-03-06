package com.example.ibudgetproject.repositories.User;

import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    User findByUserId(Long id);
    Optional<User> findByActivationCode(String activationnCode);

    List<User> findByDeletionRequestedTrue();
    List<User> findByUpdateRequestedTrue();
}
