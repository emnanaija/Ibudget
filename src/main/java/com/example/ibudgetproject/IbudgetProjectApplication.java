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
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EntityScan(basePackages = "com.example.ibudgetproject.entities")
@EnableJpaAuditing
@EnableAsync
public class IbudgetProjectApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(IbudgetProjectApplication.class);
        app.run(args);
        // generateSecretKey();
    }
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*") // Allow all origins
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow specific HTTP methods
                        .allowedHeaders("*"); // Allow all headers
            }
        };
    }
    @Bean
    public CommandLineRunner runner(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByName("ROLE_USER_FREMIUM").isEmpty()) {
                roleRepository.save(Role.builder().name("ROLE_USER_FREMIUM").build());
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

