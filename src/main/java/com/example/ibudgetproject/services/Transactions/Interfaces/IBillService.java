package com.example.ibudgetproject.services.Transactions.Interfaces;

import com.example.ibudgetproject.entities.Transactions.Bill;

import java.time.LocalDate;
import java.util.List;

public interface IBillService {
    Bill addBill(Bill bill);
    Bill addBillFromTemplate(String templateType, double amount, LocalDate dueDate, String beneficiary);
    Bill addRecurringBill(Bill bill, int intervalInMonths);
    List<Bill> suggestBills();
}