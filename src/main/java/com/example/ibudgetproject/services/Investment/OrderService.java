package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Order;
import com.example.ibudgetproject.entities.Investment.OrderItem;
import com.example.ibudgetproject.entities.Investment.domain.OrderType;
import com.example.ibudgetproject.entities.User.User;

import java.util.List;

public interface OrderService {
    Order createOrder(User user, OrderItem orderItem, OrderType orderType);
    Order getOrderById(Long orderId) throws Exception;
    List<Order>getAllOrdersOfUser(Long userId, OrderType orderType,String assetSymbol);

    Order processOrder(Coin coin, double quntity, OrderType orderType,User user) throws Exception;


}
