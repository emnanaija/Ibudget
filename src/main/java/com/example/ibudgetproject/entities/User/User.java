package com.example.ibudgetproject.entities.User;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name="_users")
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails, Principal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @JsonProperty("firstName")
    private String firstName ;
    @JsonProperty("lastName")
    private String lastName ;
    @Column(unique = true,nullable = false)
    @JsonProperty("email")
    private String email ;
    @Column(nullable = false)
    private String password ;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth ;

    @Enumerated(EnumType.STRING)
    private Gender gender;
    private String profession;
    private Boolean accountLocked ;
    private int failedAttempts = 0;
    private boolean  accountEnabled  ;

    @Enumerated(EnumType.STRING)
    private TypeAccount accountType;


    private String activationCode;
    private LocalDateTime activationCodeExpiry;

    @CreatedDate
    @Column(nullable = false,updatable = false)
    private LocalDateTime createdDate;
    @LastModifiedDate
    @Column(insertable= false)
   private LocalDateTime lastModifiedDate;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_FK")
    private Role role;

    @Override
    public String getName() {
        return email;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password=password;
    }




    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
       // List authorities=new ArrayList();
       // authorities.add(new SimpleGrantedAuthority(this.role.getName()));
       // return authorities;
        return Collections.singleton(new SimpleGrantedAuthority("User"));
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
       return !accountLocked ;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
      return accountEnabled;
   }
    public String fullName(){
        return firstName+" "+lastName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }





    //rayen ----------------------------------------------------------------------------------------------------------
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private SimCardAccount simCardAccount;
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SimTransactions> sentTransactions;
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SimTransactions> receivedTransactions;

    public SimCardAccount getSimCardAccount() {
        return simCardAccount;
    }

    public void setSimCardAccount(SimCardAccount simCardAccount) {
        this.simCardAccount = simCardAccount;
    }

    public List<SimTransactions> getSentTransactions() {
        return sentTransactions;
    }

    public void setSentTransactions(List<SimTransactions> sentTransactions) {
        this.sentTransactions = sentTransactions;
    }

    public List<SimTransactions> getReceivedTransactions() {
        return receivedTransactions;
    }

    public void setReceivedTransactions(List<SimTransactions> receivedTransactions) {
        this.receivedTransactions = receivedTransactions;
    }
    @Column(unique = true,nullable = false)
    @JsonProperty("phoneNumber")
    private String phoneNumber;
    public String getPhoneNumber() {
        return phoneNumber;
    }


}
