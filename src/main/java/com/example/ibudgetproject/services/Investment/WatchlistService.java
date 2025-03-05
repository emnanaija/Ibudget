package com.example.ibudgetproject.services.Investment;


import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Watchlist;
import com.example.ibudgetproject.entities.User.User;

public interface WatchlistService {

    Watchlist findUserWatchlist(Long userId) throws Exception;
    Watchlist createWatchlist(User user);
    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchlist(Coin coin, User user) throws Exception;
}
