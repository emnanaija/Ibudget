package com.example.ibudgetproject.services.Transactions;


import com.example.ibudgetproject.repositories.Transactions.BillRepository;
import com.example.ibudgetproject.services.Transactions.Interfaces.IBillService;
import org.springframework.stereotype.Service;

import com.example.ibudgetproject.entities.Transactions.Bill;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class BillService implements IBillService {
    @Autowired
    private BillRepository billRepository;

    private final Random random = new Random();

    // Possible bill types
    private final String[] billTypes = {
            "Electricity", "Water", "Internet",
            "Phone", "Rent", "Insurance", "Credit Card"
    };

    // Possible beneficiaries
    private final String[] beneficiaries = {
            "National Electric", "City Water Co.",
            "Global Internet", "Mobile Plus",
            "Prime Properties", "SafeGuard Insurance"
    };

    public List<Bill> generateRandomBills(int count) {
        List<Bill> bills = new ArrayList<>();

        for (int i = 0; i < count; i++) {
            Bill bill = new Bill();
            bill.setBillType(billTypes[random.nextInt(billTypes.length)]);
            bill.setAmount(50 + random.nextDouble() * 500); // $50-$550
            bill.setDueDate(LocalDate.now().plusDays(random.nextInt(30))); // Due in next 30 days
            bill.setStatus(random.nextBoolean() ? "PENDING" : "PAID");
            bill.setRecurring(random.nextBoolean());
            bill.setBeneficiary(beneficiaries[random.nextInt(beneficiaries.length)]);

            if (bill.isRecurring()) {
                bill.setNextDueDate(bill.getDueDate().plusMonths(1));
            }

            bills.add(bill);
        }

        return bills;
    }

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
