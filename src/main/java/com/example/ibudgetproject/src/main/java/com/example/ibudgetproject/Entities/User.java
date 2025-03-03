
package com.example.ibudgetproject.Entities;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Entity
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idUser;
    private String firstName;
    private String lastName;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = true)
    private String phoneNumber;
    @Column(nullable = false)
    private String role;
    @Column(nullable = false)
    private String profession;
    @Column(nullable = false)
    private int age ;
    @Column(nullable = false)
    private String sexe;

    public String getProfession() {
        return profession;
    }

    public int getAge() {
        return age;
    }

    public String getSexe() {
        return sexe;
    }


//getters w setters lin nrakah lombok

    public long getIdUser() {
        return idUser;
    }

    public void setIdUser(long idUser) {
        this.idUser = idUser;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InsurancePolicy> insurancePolicies;



}