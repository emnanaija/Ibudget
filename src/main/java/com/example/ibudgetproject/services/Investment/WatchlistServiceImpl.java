package com.example.ibudgetproject.services.Investment;


import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Watchlist;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Investment.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class WatchlistServiceImpl implements WatchlistService{
    @Autowired
    private WatchlistRepository watchlistRepository;
    @Override
    public Watchlist findUserWatchlist(Long userId) throws Exception {
        System.out.println("Recherche de la watchlist pour l'utilisateur avec l'ID : " + userId);
        Watchlist watchlist = watchlistRepository.findByUser_UserId(userId);
        System.out.println("Résultat de la requête : " + watchlist);
        if (watchlist == null) {
            throw new Exception("watchlist not found");
        }
        return watchlist;
    }

    @Override
    public Watchlist createWatchlist(User user) {
        Watchlist watchlist= new Watchlist();
        watchlist.setUser(user);
        return watchlistRepository.save(watchlist);
    }

    @Override
    public Watchlist findById(Long id) throws Exception {
        Optional<Watchlist> watchlistOptional=watchlistRepository.findById(id);
        if(watchlistOptional.isEmpty()){
            throw new Exception("watchlist not found");
        }

        return watchlistOptional.get();
    }

    @Override
    public Coin addItemToWatchlist(Coin coin, User user) throws Exception {
        Watchlist watchlist=findUserWatchlist(user.getUserId());

        if (watchlist.getCoins().contains(coin)){
            watchlist.getCoins().remove(coin);
        }
        else watchlist.getCoins().add(coin);
        watchlistRepository.save(watchlist);
        return coin;
    }
}
