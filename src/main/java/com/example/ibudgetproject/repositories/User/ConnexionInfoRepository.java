package com.example.ibudgetproject.repositories.User;
import com.example.ibudgetproject.entities.User.ConnexionInformation;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnexionInfoRepository extends JpaRepository<ConnexionInformation,Long> {

   List<ConnexionInformation> findByUser(User user);
}
