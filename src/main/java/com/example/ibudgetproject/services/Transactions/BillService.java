package com.example.ibudgetproject.services.Transactions;


import com.example.ibudgetproject.repositories.Transactions.BillRepository;
import com.example.ibudgetproject.services.Transactions.Interfaces.IBillService;
import org.springframework.stereotype.Service;

import com.example.ibudgetproject.entities.Transactions.Bill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BillService implements IBillService {
    @Autowired
    private BillRepository billRepository;

    @Override
    public Bill addBill(Bill bill) {
        return billRepository.save(bill);
    }

    @Override
    public Bill addBillFromTemplate(String templateType, double amount, LocalDate dueDate, String beneficiary) {
        Bill bill = new Bill();
        bill.setBillType(templateType);
        bill.setAmount(amount);
        bill.setDueDate(dueDate);
        bill.setBeneficiary(beneficiary); // Use the new field
        return billRepository.save(bill);
    }

    @Override
    public Bill addRecurringBill(Bill bill, int intervalInMonths) {
        bill.setRecurring(true);
        bill.setNextDueDate(bill.getDueDate().plusMonths(intervalInMonths));
        return billRepository.save(bill);
    }

    @Override
    public List<Bill> suggestBills() {
        // Use the custom query method
        return billRepository.findTop5ByOrderByDueDateDesc();
    }
}
