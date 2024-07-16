package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(schema = "letter", name = "participants")
@Data
public class Participant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name = "fullname")
    private String fullName;
    @Column(name = "initials")
    private String initials;
    @Column(name = "post")
    private String post;
    @Column(name = "can_sign")
    private boolean canSign;
}
