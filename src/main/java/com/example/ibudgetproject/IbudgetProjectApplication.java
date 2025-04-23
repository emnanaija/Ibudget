package com.example.ibudgetproject;

import com.example.ibudgetproject.entities.User.Role;
import com.example.ibudgetproject.repositories.User.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EntityScan(basePackages = "com.example.ibudgetproject.entities")
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
public class IbudgetProjectApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(IbudgetProjectApplication.class);
        app.run(args);
        // generateSecretKey();
    }

    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
                roleRepository.save(Role.builder().name("ROLE_ADMIN").build());
            }
        };
    }
    /*public static void generateSecretKey(){
        try {
            KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            keyGen.init(256);
            SecretKey sk =keyGen.generateKey();
            String secretKey= Base64.getEncoder().encodeToString(sk.getEncoded());
            System.out.println(secretKey);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }*/
}

