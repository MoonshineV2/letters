package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(schema = "letter", name = "document_types")
@Data
@NoArgsConstructor
public class DocumentType {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "document_types_id_seq")
    @SequenceGenerator(name="document_types_id_seq",
            sequenceName="document_names_id_seq", allocationSize=1)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    public DocumentType(int id) {
        this.id = id;
    }
}
