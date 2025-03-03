package com.example.ibudgetproject.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    @JsonProperty("fileName")
    private String fileName;
    @JsonProperty("filePath")
    private String filePath;
    @JsonProperty("description")
    private String description;

@ManyToOne
private Claim claim ;

    public Long getId() {
        return id;
    }
}


