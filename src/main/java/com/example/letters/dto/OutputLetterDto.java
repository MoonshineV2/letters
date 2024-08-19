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

    private boolean isAnswer;

    private boolean prilojenie;

    private String topic;

    private List<Integer> tagIds;

    private String note;

    private boolean isReserve;

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
        dto.isAnswer = outputLetter.isAnswer();
        dto.prilojenie = outputLetter.isPrilojenie();
        dto.topic = outputLetter.getTopic();
        dto.tagIds = outputLetter.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        dto.note = outputLetter.getNote();
        dto.isReserve = outputLetter.isReserve();
        dto.file = outputLetter.getFile();
        dto.documentNum = outputLetter.getDocumentNum();

        return dto;
    }

    public OutputLetter toOutputLetter() {
        OutputLetter outputLetter = new OutputLetter();
        outputLetter.setId(getId());
        outputLetter.setYear(getYear());
        outputLetter.setNumberIVC(getNumberIVC());
        outputLetter.setCreateDate(getCreateDate());
        outputLetter.setRegistrationDate(getRegistrationDate());
        outputLetter.setDocumentDate(getDocumentDate());
        outputLetter.setDocumentName(getDocumentName());

        return outputLetter;
    }
}
