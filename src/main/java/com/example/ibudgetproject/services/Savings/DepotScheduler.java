package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.services.Savings.DepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.List;
import java.util.Date;
@Service
public class DepotScheduler {
    @Autowired
    private DepotService depotService;

    @Scheduled(cron = "0 0 0 * * ?") // Exécute tous les jours à minuit
    public void effectuerDepotsRecurrents() {
        List<Depot> depotsRecurrents = depotService.findDepotsRecurrents();
        for (Depot depot : depotsRecurrents) {
            if (depot.getprochainDepot().equals(new Date())) {
                depotService.effectuerDepot(depot);
                depotService.calculerProchainDepot(depot); // Met à jour la date du prochain dépôt
            }
        }
    }
}
