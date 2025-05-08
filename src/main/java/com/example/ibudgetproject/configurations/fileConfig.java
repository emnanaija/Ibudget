package com.example.ibudgetproject.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class fileConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Mapping URL "/uploads/**" vers le dossier local C:/uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/C:/uploads/");
    }
}