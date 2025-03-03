package com.example.ibudgetproject.controllers.Transactions;

import com.example.ibudgetproject.entities.Transactions.Bill;

import com.example.ibudgetproject.services.Transactions.Interfaces.IBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    @Autowired
    private IBillService billService;

    @PostMapping("/add")
    public Bill addBill(@RequestBody Bill bill) {
        return billService.addBill(bill);
    }

    @PostMapping("/add-from-template")
    public Bill addBillFromTemplate(@RequestParam String templateType, @RequestParam double amount,
                                    @RequestParam String dueDate, @RequestParam String beneficiary) {
        return billService.addBillFromTemplate(templateType, amount, LocalDate.parse(dueDate), beneficiary);
    }

    @PostMapping("/add-recurring")
    public Bill addRecurringBill(@RequestBody Bill bill, @RequestParam int intervalInMonths) {
        return billService.addRecurringBill(bill, intervalInMonths);
    }

    @GetMapping("/suggestions")
    public List<Bill> getBillSuggestions() {
        return billService.suggestBills();
    }
}