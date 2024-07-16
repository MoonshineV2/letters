package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(schema = "letter", name = "workgroups")
@Data
public class Workgroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", columnDefinition = "bpchar", length = 15)
    private String name;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="leader_id")
    private Worker leader;
}
