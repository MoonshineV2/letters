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

    private String outputNumber;

    private boolean isAnswer;

    private boolean prilojenie;

    private String topic;

    private List<Integer> tagIds;

    private String note;

    private boolean isReserve;

    private byte[] file;

    public static OutputLetterDto fromOutputLetter(OutputLetter outputLetter) {
        OutputLetterDto dto = new OutputLetterDto();
        dto.id = outputLetter.getId();
        dto.year = outputLetter.getYear();
        dto.numberIVC = outputLetter.getNumberIVC();
        dto.createDate = outputLetter.getCreateDate();
        dto.registrationDate = outputLetter.getRegistrationDate();
        dto.documentDate = outputLetter.getDocumentDate();
        dto.documentName = outputLetter.getDocumentName();
        dto.documentTypeId = outputLetter.getDocumentType().getId();
        dto.addressId = outputLetter.getAddress().getId();
        dto.targetParticipantId = outputLetter.getTargetParticipant().getId();
        dto.signerId = outputLetter.getSigner().getId();
        dto.executorId = outputLetter.getExecutor().getId();
        dto.easdNumber = outputLetter.getEasdNumber();
        dto.outputNumber = outputLetter.getOutputNumber();
        dto.isAnswer = outputLetter.isAnswer();
        dto.prilojenie = outputLetter.isPrilojenie();
        dto.topic = outputLetter.getTopic();
        dto.tagIds = outputLetter.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        dto.note = outputLetter.getNote();
        dto.isReserve = outputLetter.isReserve();
        dto.file = outputLetter.getFile();

        return dto;
    }
}
