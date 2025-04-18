package com.example.ibudgetproject.repositories.User;

import com.example.ibudgetproject.entities.User.TypeAccount;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(Long id);  // Find user by ID

    Optional<User> findByFirstName(String firstName);  // Find user by username (optional)


    Optional<User> findByEmail(String email);
    User findByUserId(Long id);
    Optional<User> findByActivationCode(String activationnCode);

    List<User> findByDeletionRequestedTrue();
    List<User> findByUpdateRequestedTrue();

    List<User> findByAccountType(TypeAccount typeAccount);
}
