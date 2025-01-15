package com.example.letters.dto;

import com.example.letters.model.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InputLetterDto {

    public int id;

    public int year;

    public int numberIVC;

    public Timestamp createDate;

    public Date registrationDate;

    public Date postuplenieDate;

    public Date documentDate;

    public String documentNumber;

    public String documentName;

    public DocumentTypeDto documentType;

    public OriginAndAddressDto origin;

    public ParticipantDto signer;

    public ParticipantDto executor;

    public int easdNumber;

    public OutputLetterDto outputLetter;

    public boolean answer;

    public boolean prilojenie;

    public String topic;

    public List<Tag> tags;

    public String note;

    public WorkerDto targetWorker;

    public boolean isReserve;

    public byte[] file;

    public String email;

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
        if (inputLetter.getDocumentType() != null) {
            dto.documentType = DocumentTypeDto.fromDocumentType(inputLetter.getDocumentType());
        }
        if (inputLetter.getOrigin() != null) {
            dto.origin = OriginAndAddressDto.fromOriginAndAddress(inputLetter.getOrigin());
        }
        if (inputLetter.getSigner() != null) {
            dto.signer = ParticipantDto.fromParticipant(inputLetter.getSigner());
        }
        if (inputLetter.getExecutor() != null) {
            dto.executor = ParticipantDto.fromParticipant(inputLetter.getExecutor());
        }
        dto.easdNumber = inputLetter.getEasdNumber();
        dto.answer = inputLetter.isAnswer();
        dto.prilojenie = inputLetter.isPrilojenie();
        dto.topic = inputLetter.getTopic();
        if (inputLetter.getTags() != null) {
            dto.tags = inputLetter.getTags();
        }
        dto.note = inputLetter.getNote();
        if (inputLetter.getTargetWorker() != null) {
            dto.targetWorker = WorkerDto.fromWorker(inputLetter.getTargetWorker());
        }
        dto.isReserve = inputLetter.isReserve();
        //dto.file = inputLetter.getFile();
        if (inputLetter.getOutputLetter() != null) {
            dto.outputLetter = OutputLetterDto.fromOutputLetter(inputLetter.getOutputLetter());
            dto.outputLetter.setInputLetter(null);
        }
        dto.email = inputLetter.getEmail();

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
        if (documentType != null && documentType.id != 0) inputLetter.setDocumentType(documentType.toDocumentType());
        if (origin != null && origin.id != 0) inputLetter.setOrigin(origin.toOriginAndAddress());
        if (signer != null && signer.id != 0) inputLetter.setSigner(signer.toParticipant());
        if (executor != null && executor.id != 0) inputLetter.setExecutor(executor.toParticipant());
        inputLetter.setEasdNumber(easdNumber);
        inputLetter.setAnswer(answer);
        inputLetter.setPrilojenie(prilojenie);
        inputLetter.setTopic(topic);
        inputLetter.setTags(tags);
        inputLetter.setNote(note);
        if (targetWorker != null && targetWorker.id != 0) inputLetter.setTargetWorker(targetWorker.toWorker());
        inputLetter.setReserve(isReserve);
        inputLetter.setFile(file);
        if (outputLetter != null && outputLetter.id != 0) inputLetter.setOutputLetter(outputLetter.toOutputLetter());
        inputLetter.setEmail(email);

        return inputLetter;
    }
}
