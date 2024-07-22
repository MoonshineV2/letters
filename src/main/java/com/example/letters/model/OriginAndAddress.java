package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "letter", name = "origins_adresses")
@Data
@NoArgsConstructor
public class OriginAndAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "short_name")
    private String shortName;

    @Column(name = "kod_adm")
    private int kodADM;

    public OriginAndAddress(int id) {
        this.id = id;
    }
}
