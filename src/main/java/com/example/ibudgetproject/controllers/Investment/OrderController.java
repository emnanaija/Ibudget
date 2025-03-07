package com.example.ibudgetproject.controllers.Investment;


import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Order;
import com.example.ibudgetproject.entities.Investment.domain.OrderType;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.request.CreateOrderRequest;
import com.example.ibudgetproject.services.Investment.CoinService;
import com.example.ibudgetproject.services.Investment.OrderService;
import com.example.ibudgetproject.services.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;
    @Autowired
    private CoinService coinService;


    @PostMapping("/pay")
    public ResponseEntity<Order> payOrderPayment(
            @RequestHeader("Authorization") String jwt,
            @RequestBody CreateOrderRequest req
    )
        throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        Coin coin = coinService.findById(req.getCoinId());


        Order order = orderService.processOrder(coin, req.getQuantity(), req.getOrderType(),user);
        return ResponseEntity.ok(order);

    }
@GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @RequestHeader("Authorization") String jwToken,
            @PathVariable Long orderId
) throws Exception{


        User user = userService.findUserProfileByJwt(jwToken);
        Order order = orderService.getOrderById(orderId);
        if (order.getUser().getUserId().equals(user.getUserId())){return ResponseEntity.ok(order);
        }else{
            throw new Exception("You Don't Have Access");
        }
}

    @GetMapping()
    public ResponseEntity<List<Order>> getAllOrdersForUser(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(required = false) OrderType order_type,
            @RequestParam(required = false) String asset_symbol
    ) throws Exception {

        Long userId= userService.findUserProfileByJwt(jwt).getUserId();
        List<Order> userOrders = orderService.getAllOrdersOfUser(userId,order_type,asset_symbol);

         return ResponseEntity.ok(userOrders);
    }



}
