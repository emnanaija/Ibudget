package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Asset;
import com.example.ibudgetproject.entities.Investment.Coin;
import com.example.ibudgetproject.entities.Investment.Order;
import com.example.ibudgetproject.entities.Investment.OrderItem;
import com.example.ibudgetproject.entities.Investment.domain.OrderStatus;
import com.example.ibudgetproject.entities.Investment.domain.OrderType;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Investment.OrderItemRepository;
import com.example.ibudgetproject.repositories.Investment.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private WalletService walletService;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private AssetService assetService;

    @Override
    public Order createOrder(User user, OrderItem orderItem, OrderType orderType) {

        double price = orderItem.getCoin().getCurrentPrice() * orderItem.getQuantity();

        Order order = new Order();
        order.setUser(user);
        order.setOrderItem(orderItem);
        order.setOrderType(orderType);
        order.setPrice(BigDecimal.valueOf(price));
        order.setTimestamp(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        return orderRepository.save(order);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId).orElseThrow(() -> new Exception("Order Not Found"));

    }

    @Override
    public List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol) {
        return orderRepository.findByUser_UserId(userId);
    }

    private OrderItem createOrderItem(Coin coin, double quantity, double buyPrice, double sellPrice) {

        OrderItem orderItem = new OrderItem();
        orderItem.setCoin(coin);
        orderItem.setQuantity(quantity);
        orderItem.setBuyPrice(buyPrice);
        orderItem.setSellPrice(sellPrice);
        return orderItemRepository.save(orderItem);

    }

    @Transactional
    public Order buyAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("quantity shoud be >0");
        }

        double buyPrice = coin.getCurrentPrice();

        OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, 0);
        Order order = createOrder(user, orderItem, OrderType.BUY);
        orderItem.setOrder(order);

        walletService.payOrderPayment(order, user);

        order.setStatus(OrderStatus.SUCCESS);
        order.setOrderType(OrderType.BUY);
        Order savedOrder = orderRepository.save(order);

// create asset
        Asset oldAsset = assetService.findAssetByUserIdAndCoinId(
                order.getUser().getUserId(),
                order.getOrderItem().getCoin().getId());

        if (oldAsset == null) {
            assetService.createAsset(user, orderItem.getCoin(), orderItem.getQuantity());

        } else {
            assetService.updateAsset(oldAsset.getId(), quantity);
        }


        return savedOrder;
    }

    @Transactional
    public Order sellAsset(Coin coin, double quantity, User user) throws Exception {
        if (quantity <= 0) {
            throw new Exception("quantity shoud be >0");
        }

        double sellPrice = coin.getCurrentPrice();

        Asset assetTosell = assetService.findAssetByUserIdAndCoinId(user.getUserId(), coin.getId());
        double buyPrice = assetTosell.getBuyPrice();
        if (assetTosell != null) {
            OrderItem orderItem = createOrderItem(coin, quantity, buyPrice, sellPrice);




            Order order = createOrder(user, orderItem, OrderType.SELL);
            orderItem.setOrder(order);

            if (assetTosell.getQuantity() >= quantity) {
                order.setStatus(OrderStatus.SUCCESS);
                order.setOrderType(OrderType.SELL);
                Order savedOrder = orderRepository.save(order);


                walletService.payOrderPayment(order, user);

                Asset updatedAsset=assetService.updateAsset(assetTosell.getId(),-quantity);

                if (updatedAsset.getQuantity() * coin.getCurrentPrice() <= 1) {
                    assetService.deleteAsset(updatedAsset.getId());
                }

                return savedOrder;

            }
            throw new Exception("Insufficient quantity to sell");

        }
        throw new Exception("asset not found");
    }

    @Override
    @Transactional
    public Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception {
         if(orderType.equals(OrderType.BUY)){
             return buyAsset(coin,quantity,user);
         }
         else if (orderType.equals(OrderType.SELL)){
             return sellAsset(coin,quantity,user);
         }
         throw new Exception("invalid order type");
    }
}
