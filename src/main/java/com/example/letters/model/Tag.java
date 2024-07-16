package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(schema = "letter", name = "tags")
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "text")
    private String text;
}
