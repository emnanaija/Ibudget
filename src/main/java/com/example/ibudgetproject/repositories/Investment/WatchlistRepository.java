package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {

    Watchlist findByUser_UserId(Long userId);

}
