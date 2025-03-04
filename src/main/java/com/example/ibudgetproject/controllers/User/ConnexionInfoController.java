package com.example.ibudgetproject.controllers.User;

import com.example.ibudgetproject.entities.User.ConnexionInformation;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.services.User.Interfaces.IConnexionInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connexionInfo")
public class ConnexionInfoController {
    @Autowired
    private IConnexionInfoService service;

    @GetMapping("/getAll")
    public List<ConnexionInformation> getAllCnxInfo(@AuthenticationPrincipal User connectedUser)
    {
        return service.getAllCnxInfo(connectedUser);
    }
    @GetMapping("/getById")
    public ConnexionInformation getCnxInfo(@RequestParam Long id)
    {
        return service.getCnxInfoById(id);
    }

    @DeleteMapping("/deleteById")
    public ResponseEntity<String> getAllCnxInfo(@RequestParam Long id) throws Exception {
        try {
            service.deleteCnxInfoById(id);
            return ResponseEntity.ok("Device Deleted with succcess");
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @PatchMapping("/changeApproval")
    public  ResponseEntity<String> changeApproval(Long id, Boolean value,@AuthenticationPrincipal User user) throws Exception {
        try{
            service.update(id,value,user);
            return ResponseEntity.ok("Approval attribute changed with succcess");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/approveLogIn")
    public ResponseEntity<String> validateConnexionInfo(@RequestParam String token) {
        try {
            service.validateConnexionInfo(token);
            return ResponseEntity.ok("Device Approved with succcess");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
