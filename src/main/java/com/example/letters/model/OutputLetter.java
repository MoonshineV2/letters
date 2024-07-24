package com.example.letters.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Entity
@Table(schema = "letter", name = "output_letters")
@Data
public class OutputLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "year")
    private int year;

    @Column(name = "num_ivc")
    private int numberIVC;

    @Column(name = "create_date")
    private Timestamp createDate;

    @Column(name = "registration_date", columnDefinition = "date")
    private Date registrationDate;


    @Column(name = "document_date", columnDefinition = "date")
    private Date documentDate;

    @Column(name = "document_name", columnDefinition = "bpchar", length = 100)
    private String documentName;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="document_type_id")
    private DocumentType documentType;

    @ManyToOne
    @JoinColumn(name="adress_id")
    private OriginAndAddress address;

    @ManyToOne
    @JoinColumn(name="target_participant_id")
    private Participant targetParticipant;

    @ManyToOne
    @JoinColumn(name="signer_id")
    private Participant signer;

    @ManyToOne
    @JoinColumn(name="executor_id")
    private Participant executor;

    @Column(name = "easd_num", columnDefinition = "numeric")
    private int easdNumber;

    @Column(name = "input_num")
    private String outputNumber;

    @Column(name = "is_answer")
    private boolean isAnswer;

    @Column(name = "prilojenie")
    private boolean prilojenie;

    @Column(name = "topic", columnDefinition = "bpchar", length = 100)
    private String topic;

    @ManyToMany
    @JoinTable(
            schema = "letter",
            name = "tags_input",
            joinColumns = @JoinColumn(name = "input_letter_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private List<Tag> tags;

    @Column(name = "note", columnDefinition = "bpchar", length = 500)
    private String note;

    @Column(name = "reserve")
    private boolean isReserve;

    @Column(name = "file")
    private byte[] file;
}
