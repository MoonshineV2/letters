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

    public int id;

    public int year;

    public int numberIVC;

    public Timestamp createDate;

    public Date registrationDate;

    public Date documentDate;

    public String documentNumber;

    public String documentName;

    public DocumentTypeDto documentType;

    public OriginAndAddressDto address;

    public ParticipantDto targetParticipant;

    public WorkerDto signer;

    public WorkerDto executor;

    public int easdNumber;

    public InputLetterDto inputLetter;

    public boolean answer;

    public boolean prilojenie;

    public String topic;

    public List<Tag> tags;

    public String note;

    public boolean reserve;

    public byte[] file;

    public String email;

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
            dto.signer = WorkerDto.fromWorker(outputLetter.getSigner());
        }
        if (outputLetter.getExecutor() != null) {
            dto.executor = WorkerDto.fromWorker(outputLetter.getExecutor());
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
        dto.documentNumber = outputLetter.getDocumentNumber();
        dto.email = outputLetter.getEmail();

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
        if (documentType != null && documentType.id != 0) outputLetter.setDocumentType(documentType.toDocumentType());
        if (address != null && address.id != 0) outputLetter.setAddress(address.toOriginAndAddress());
        if (targetParticipant != null && targetParticipant.id != 0) outputLetter.setTargetParticipant(targetParticipant.toParticipant());
        if (signer != null && signer.id != 0) outputLetter.setSigner(signer.toWorker());
        if (executor != null && executor.id != 0) outputLetter.setExecutor(executor.toWorker());
        outputLetter.setEasdNumber(easdNumber);
        if (inputLetter != null && inputLetter.id != 0) outputLetter.setInputLetter(inputLetter.toInputLetter());
        outputLetter.setAnswer(answer);
        outputLetter.setPrilojenie(prilojenie);
        outputLetter.setTopic(topic);
        outputLetter.setTags(tags);
        outputLetter.setNote(note);
        outputLetter.setReserve(reserve);
        outputLetter.setFile(file);
        outputLetter.setDocumentNumber(documentNumber);
        outputLetter.setEmail(email);

        return outputLetter;
    }
}
