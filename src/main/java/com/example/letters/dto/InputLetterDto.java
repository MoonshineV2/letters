package com.example.letters.dto;

import com.example.letters.model.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class InputLetterDto {

    private int id;

    private int year;

    private int numberIVC;

    private Timestamp createDate;

    private Date registrationDate;

    private Date postuplenieDate;

    private Date documentDate;

    private String documentNumber;

    private String documentName;

    private int documentTypeId;

    private int originId;

    private int signerId;

    private int executorId;

    private int easdNumber;

    private String outputNumber;

    private boolean answer;

    private boolean prilojenie;

    private String topic;

    private List<Integer> tagIds;

    private String note;

    private int targetWorkerId;

    private boolean isReserve;

    private byte[] file;

    public static InputLetterDto fromInputLetter(InputLetter inputLetter) {
        InputLetterDto dto = new InputLetterDto();
        dto.id = inputLetter.getId();
        dto.year = inputLetter.getYear();
        dto.numberIVC = inputLetter.getNumberIVC();
        dto.createDate = inputLetter.getCreateDate();
        dto.registrationDate = inputLetter.getRegistrationDate();
        dto.postuplenieDate = inputLetter.getPostuplenieDate();
        dto.documentDate = inputLetter.getDocumentDate();
        dto.documentNumber = inputLetter.getDocumentNumber();
        dto.documentName = inputLetter.getDocumentName();
        dto.documentTypeId = inputLetter.getDocumentType() != null ? inputLetter.getDocumentType().getId() : 0;
        dto.originId = inputLetter.getOrigin().getId();
        dto.signerId = inputLetter.getSigner().getId();
        dto.executorId = inputLetter.getExecutor().getId();
        dto.easdNumber = inputLetter.getEasdNumber();
        dto.answer = inputLetter.isAnswer();
        dto.prilojenie = inputLetter.isPrilojenie();
        dto.topic = inputLetter.getTopic();
        dto.tagIds = inputLetter.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        dto.note = inputLetter.getNote();
        dto.targetWorkerId = inputLetter.getTargetWorker().getId();
        dto.isReserve = inputLetter.isReserve();
        dto.file = inputLetter.getFile();

        return dto;
    }

    public InputLetter toInputLetter() {
        InputLetter inputLetter = new InputLetter();
        inputLetter.setId(getId());
        inputLetter.setYear(getYear());
        inputLetter.setNumberIVC(getNumberIVC());
        inputLetter.setCreateDate(getCreateDate());
        inputLetter.setRegistrationDate(getRegistrationDate());
        inputLetter.setPostuplenieDate(getPostuplenieDate());
        inputLetter.setDocumentDate(getDocumentDate());
        inputLetter.setDocumentNumber(getDocumentNumber());
        inputLetter.setDocumentName(getDocumentName());
        inputLetter.setDocumentType(new DocumentType(getDocumentTypeId()));
        inputLetter.setOrigin(new OriginAndAddress(getOriginId()));
        inputLetter.setSigner(new Participant(getSignerId()));
        inputLetter.setExecutor(new Participant(getExecutorId()));
        inputLetter.setEasdNumber(getEasdNumber());
        inputLetter.setAnswer(isAnswer());
        inputLetter.setPrilojenie(isPrilojenie());
        inputLetter.setTopic(getTopic());
        inputLetter.setTags(getTagIds().stream().map(Tag::new).collect(Collectors.toList()));
        inputLetter.setNote(getNote());
        inputLetter.setTargetWorker(new Worker(getTargetWorkerId()));
        inputLetter.setReserve(isReserve());
        inputLetter.setFile(file);

        return inputLetter;
    }
}
