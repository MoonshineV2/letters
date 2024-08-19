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

    private int outputLetterId;

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
        dto.outputLetterId = inputLetter.getOutputLetter() != null  ? inputLetter.getOutputLetter().getId() : 0;

        return dto;
    }

    public InputLetter toInputLetter() {
        InputLetter inputLetter = new InputLetter();
        inputLetter.setId(id);
        inputLetter.setYear(year);
        inputLetter.setNumberIVC(numberIVC);
        inputLetter.setCreateDate(createDate);
        inputLetter.setRegistrationDate(registrationDate);
        inputLetter.setPostuplenieDate(postuplenieDate);
        inputLetter.setDocumentDate(documentDate);
        inputLetter.setDocumentNumber(documentNumber);
        inputLetter.setDocumentName(documentName);
        inputLetter.setDocumentType(new DocumentType(documentTypeId));
        inputLetter.setOrigin(new OriginAndAddress(originId));
        inputLetter.setSigner(new Participant(signerId));
        inputLetter.setExecutor(new Participant(executorId));
        inputLetter.setEasdNumber(easdNumber);
        inputLetter.setAnswer(answer);
        inputLetter.setPrilojenie(prilojenie);
        inputLetter.setTopic(topic);
        inputLetter.setTags(tagIds.stream().map(Tag::new).collect(Collectors.toList()));
        inputLetter.setNote(note);
        inputLetter.setTargetWorker(new Worker(targetWorkerId));
        inputLetter.setReserve(isReserve);
        inputLetter.setFile(file);
        inputLetter.setOutputLetter(new OutputLetter(outputLetterId));

        return inputLetter;
    }
}
