package com.example.ibudgetproject.controllers.Investment;

import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Watchlist;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.Investment.CoinService;
import com.example.ibudgetproject.services.Investment.WatchlistService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private UserService userService;
    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private CoinService coinService;

    @GetMapping("/user")
    public ResponseEntity<Watchlist> getUserWatchlist(
            @RequestHeader("Authorization") String jwt
    ) throws Exception{
        User user=userService.findUserProfileByJwt(jwt);
        Watchlist watchlist= watchlistService.findUserWatchlist(user.getUserId());
        return ResponseEntity.ok(watchlist);
    }

    @GetMapping("/{watchlistId}")
    public ResponseEntity<Watchlist> getWatchlistById(
            @PathVariable long WatchlistId
    ) throws Exception {
        Watchlist Watchlist = watchlistService.findById(WatchlistId);
        return ResponseEntity.ok(Watchlist);
    }

    @PatchMapping("/add/coin/{coinId}")
    public ResponseEntity<Coin> addCoinToWatchlist(
            @RequestHeader("Authorization") String jwt,
            @PathVariable String coinId) throws Exception{

        User user=userService.findUserProfileByJwt(jwt);
        Coin coin=coinService.findById(coinId);
        Coin addedCoin= watchlistService.addItemToWatchlist(coin,user);
        return ResponseEntity.ok(addedCoin);


    }


}
