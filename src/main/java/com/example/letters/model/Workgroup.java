package com.example.letters.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "letter", name = "workgroups")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Workgroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name", columnDefinition = "bpchar", length = 15)
    private String name;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="leader_id")
    private Worker leader;

    @Column(name = "disabled")
    private boolean disabled;

    public Workgroup(int id) {
        this.id = id;
    }


}
