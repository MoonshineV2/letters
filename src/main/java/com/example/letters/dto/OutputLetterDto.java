package com.example.letters.dto;

import com.example.letters.model.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Data
public class OutputLetterDto {

    private int id;

    private int year;

    private int numberIVC;

    private Timestamp createDate;

    private Date registrationDate;

    private Date documentDate;

    private String documentName;

    private int documentTypeId;

    private int addressId;

    private int targetParticipantId;

    private int signerId;

    private int executorId;

    private int easdNumber;

    private int inputLetterId;

    private boolean answer;

    private boolean prilojenie;

    private String topic;

    private List<Integer> tagIds;

    private String note;

    private boolean reserve;

    private byte[] file;

    private String documentNum;

    public static OutputLetterDto fromOutputLetter(OutputLetter outputLetter) {
        OutputLetterDto dto = new OutputLetterDto();
        dto.id = outputLetter.getId();
        dto.year = outputLetter.getYear();
        dto.numberIVC = outputLetter.getNumberIVC();
        dto.createDate = outputLetter.getCreateDate();
        dto.registrationDate = outputLetter.getRegistrationDate();
        dto.documentDate = outputLetter.getDocumentDate();
        dto.documentName = outputLetter.getDocumentName();
        if (outputLetter.getDocumentType() != null) {
            dto.documentTypeId = outputLetter.getDocumentType().getId();
        }
        if (outputLetter.getAddress() != null) {
            dto.addressId = outputLetter.getAddress().getId();
        }
        if (outputLetter.getTargetParticipant() != null) {
            dto.targetParticipantId = outputLetter.getTargetParticipant().getId();
        }
        if (outputLetter.getSigner() != null) {
            dto.signerId = outputLetter.getSigner().getId();
        }
        if (outputLetter.getExecutor() != null) {
            dto.executorId = outputLetter.getExecutor().getId();
        }
        dto.easdNumber = outputLetter.getEasdNumber();
        if (outputLetter.getInputLetter() != null) {
            dto.inputLetterId =outputLetter.getInputLetter().getId();
        }
        dto.answer = outputLetter.isAnswer();
        dto.prilojenie = outputLetter.isPrilojenie();
        dto.topic = outputLetter.getTopic();
        if (outputLetter.getTags() != null) {
            dto.tagIds = outputLetter.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        }
        dto.note = outputLetter.getNote();
        dto.reserve = outputLetter.isReserve();
        dto.file = outputLetter.getFile();
        dto.documentNum = outputLetter.getDocumentNum();

        return dto;
    }

    public OutputLetter toOutputLetter() {
        OutputLetter outputLetter = new OutputLetter();
        outputLetter.setId(id);
        outputLetter.setYear(year);
        outputLetter.setNumberIVC(numberIVC);
        outputLetter.setCreateDate(createDate);
        outputLetter.setRegistrationDate(registrationDate);
        outputLetter.setDocumentDate(documentDate);
        outputLetter.setDocumentName(documentName);
        if (documentTypeId > 0) outputLetter.setDocumentType(new DocumentType(documentTypeId));
        if (addressId > 0) outputLetter.setAddress(new OriginAndAddress(addressId));
        if (targetParticipantId > 0) outputLetter.setTargetParticipant(new Participant(targetParticipantId));
        if (signerId > 0) outputLetter.setSigner(new Participant(signerId));
        if (executorId > 0) outputLetter.setExecutor(new Participant(executorId));
        outputLetter.setEasdNumber(easdNumber);
        if (inputLetterId > 0) outputLetter.setInputLetter(new InputLetter(inputLetterId));
        outputLetter.setAnswer(answer);
        outputLetter.setPrilojenie(prilojenie);
        outputLetter.setTopic(topic);
        outputLetter.setTags(tagIds.stream().map(Tag::new).collect(Collectors.toList()));
        outputLetter.setNote(note);
        outputLetter.setReserve(reserve);
        outputLetter.setFile(file);
        outputLetter.setDocumentNum(documentNum);

        return outputLetter;
    }
}
