package com.example.letters.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "letter", name = "workers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "fullname")
    private String fullName;

    @Column(name = "initials")
    private String initials;

    @Column(name = "post")
    private String post;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workgroup_id")
    private Workgroup workgroup;

    @Column(name = "can_sign")
    private boolean canSign;

    @Column(name = "disabled")
    private boolean disabled;

    public Worker(int id) {
        this.id = id;
    }
}
