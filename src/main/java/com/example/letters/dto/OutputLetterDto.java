package com.example.letters.dto;

import com.example.letters.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutputLetterDto {

    private int id;

    private int year;

    private int numberIVC;

    private Timestamp createDate;

    private Date registrationDate;

    private Date documentDate;

    private String documentNumber;

    private String documentName;

    private DocumentTypeDto documentType;

    private OriginAndAddressDto address;

    private ParticipantDto targetParticipant;

    private ParticipantDto signer;

    private ParticipantDto executor;

    private int easdNumber;

    private InputLetterDto inputLetter;

    private boolean answer;

    private boolean prilojenie;

    private String topic;

    private List<Tag> tags;

    private String note;

    private boolean reserve;

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
        if (outputLetter.getDocumentType() != null) {
            dto.documentType = DocumentTypeDto.fromDocumentType(outputLetter.getDocumentType());
        }
        if (outputLetter.getAddress() != null) {
            dto.address = OriginAndAddressDto.fromOriginAndAddress(outputLetter.getAddress());
        }
        if (outputLetter.getTargetParticipant() != null) {
            dto.targetParticipant = ParticipantDto.fromParticipant(outputLetter.getTargetParticipant());
        }
        if (outputLetter.getSigner() != null) {
            dto.signer = ParticipantDto.fromParticipant(outputLetter.getSigner());
        }
        if (outputLetter.getExecutor() != null) {
            dto.executor = ParticipantDto.fromParticipant(outputLetter.getExecutor());
        }
        dto.easdNumber = outputLetter.getEasdNumber();
        if (outputLetter.getInputLetter() != null) {
            dto.inputLetter = InputLetterDto.fromInputLetter(outputLetter.getInputLetter());
            dto.inputLetter.setOutputLetter(null);
        }
        dto.answer = outputLetter.isAnswer();
        dto.prilojenie = outputLetter.isPrilojenie();
        dto.topic = outputLetter.getTopic();
        if (outputLetter.getTags() != null) {
            dto.tags = outputLetter.getTags();
        }
        dto.note = outputLetter.getNote();
        dto.reserve = outputLetter.isReserve();
        //dto.file = outputLetter.getFile();
        dto.documentNumber = outputLetter.getDocumentNum();

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
        if (documentType != null) outputLetter.setDocumentType(documentType.toDocumentType());
        if (address != null) outputLetter.setAddress(address.toOriginAndAddress());
        if (targetParticipant != null) outputLetter.setTargetParticipant(targetParticipant.toParticipant());
        if (signer != null) outputLetter.setSigner(signer.toParticipant());
        if (executor != null) outputLetter.setExecutor(executor.toParticipant());
        outputLetter.setEasdNumber(easdNumber);
        if (inputLetter != null) outputLetter.setInputLetter(inputLetter.toInputLetter());
        outputLetter.setAnswer(answer);
        outputLetter.setPrilojenie(prilojenie);
        outputLetter.setTopic(topic);
        outputLetter.setTags(tags);
        outputLetter.setNote(note);
        outputLetter.setReserve(reserve);
        outputLetter.setFile(file);
        outputLetter.setDocumentNum(documentNumber);

        return outputLetter;
    }
}
