package com.example.ibudgetproject.request;

import com.example.ibudgetproject.entities.Investment.domain.OrderType;
import lombok.Data;

@Data
public class CreateOrderRequest {
    private String coinId;
    private double quantity;
    private OrderType orderType;
}
