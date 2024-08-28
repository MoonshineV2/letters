package com.example.letters.dto;

import com.example.letters.model.*;
import lombok.Data;

import java.sql.Timestamp;
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

    private DocumentTypeInner documentType;

    private Origin origin;

    private ParticipantInner signer;

    private ParticipantInner executor;

    private int easdNumber;

    private int outputLetterId;

    private boolean answer;

    private boolean prilojenie;

    private String topic;

    private List<Integer> tagIds;

    private String note;

    private WorkerInner targetWorker;

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
        if (inputLetter.getDocumentType() != null) {
            dto.documentType = new DocumentTypeInner(
                    inputLetter.getDocumentType().getId(),
                    inputLetter.getDocumentType().getName()
            );
        }
        if (inputLetter.getOrigin() != null) {
            dto.origin = new Origin(
                    inputLetter.getOrigin().getId(),
                    inputLetter.getOrigin().getName(),
                    inputLetter.getOrigin().getShortName(),
                    inputLetter.getOrigin().getKodADM()
            );
        }
        if (inputLetter.getSigner() != null) {
            dto.signer = new ParticipantInner(
                    inputLetter.getSigner().getId(),
                    inputLetter.getSigner().getFullName(),
                    inputLetter.getSigner().getInitials(),
                    inputLetter.getSigner().getPost(),
                    inputLetter.getSigner().isCanSign()
            );
        }
        if (inputLetter.getExecutor() != null) {
            dto.executor = new ParticipantInner(
                    inputLetter.getExecutor().getId(),
                    inputLetter.getExecutor().getFullName(),
                    inputLetter.getExecutor().getInitials(),
                    inputLetter.getExecutor().getPost(),
                    inputLetter.getExecutor().isCanSign()
            );
        }
        dto.easdNumber = inputLetter.getEasdNumber();
        dto.answer = inputLetter.isAnswer();
        dto.prilojenie = inputLetter.isPrilojenie();
        dto.topic = inputLetter.getTopic();
        if (inputLetter.getTags() != null) {
            dto.tagIds = inputLetter.getTags().stream().map(Tag::getId).collect(Collectors.toList());
        }
        dto.note = inputLetter.getNote();
        if (inputLetter.getTargetWorker() != null) {
            dto.targetWorker = new WorkerInner(
                    inputLetter.getTargetWorker().getId(),
                    inputLetter.getTargetWorker().getFullName(),
                    inputLetter.getTargetWorker().getInitials(),
                    inputLetter.getTargetWorker().getPost(),
                    inputLetter.getTargetWorker().getWorkgroup() != null ? inputLetter.getTargetWorker().getWorkgroup().getId() : 0,
                    inputLetter.getTargetWorker().getWorkgroup() != null ? inputLetter.getTargetWorker().getWorkgroup().getName() : "",
                    inputLetter.getTargetWorker().isCanSign()
            );
        }
        dto.isReserve = inputLetter.isReserve();
        //dto.file = inputLetter.getFile();
        if (inputLetter.getOutputLetter() != null) {
            dto.outputLetterId = inputLetter.getOutputLetter().getId();
        }

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
        if (documentType != null) inputLetter.setDocumentType(new DocumentType(documentType.id));
        if (origin != null) inputLetter.setOrigin(new OriginAndAddress(origin.id));
        if (signer != null) inputLetter.setSigner(new Participant(signer.id));
        if (executor != null) inputLetter.setExecutor(new Participant(executor.id));
        inputLetter.setEasdNumber(easdNumber);
        inputLetter.setAnswer(answer);
        inputLetter.setPrilojenie(prilojenie);
        inputLetter.setTopic(topic);
        inputLetter.setTags(tagIds.stream().map(Tag::new).collect(Collectors.toList()));
        inputLetter.setNote(note);
        if (targetWorker != null) inputLetter.setTargetWorker(new Worker(targetWorker.workgroupId));
        inputLetter.setReserve(isReserve);
        inputLetter.setFile(file);
        if (outputLetterId > 0) inputLetter.setOutputLetter(new OutputLetter(outputLetterId));

        return inputLetter;
    }

    private static class DocumentTypeInner {
        public int id;
        public String name;

        public DocumentTypeInner(int id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    private static class Origin {
        public int id;
        public String name;
        public String shortName;
        public int kodADM;

        public Origin(int id, String name, String shortName, int kodADM) {
            this.id = id;
            this.name = name;
            this.shortName = shortName;
            this.kodADM = kodADM;
        }
    }

    private static class ParticipantInner {
        public int id;
        public String fullName;
        public String initials;
        public String post;
        public boolean canSign;

        public ParticipantInner(int id, String fullName, String initials, String post, boolean canSign) {
            this.id = id;
            this.fullName = fullName;
            this.initials = initials;
            this.post = post;
            this.canSign = canSign;
        }
    }

    private static class WorkerInner {
        public int id;
        public String fullName;
        public String initials;
        public String post;
        public int workgroupId;
        public String workgroupName;
        public boolean canSign;

        public WorkerInner(int id, String fullName, String initials, String post, int workgroupId, String workgroupName, boolean canSign) {
            this.id = id;
            this.fullName = fullName;
            this.initials = initials;
            this.post = post;
            this.workgroupId = workgroupId;
            this.workgroupName = workgroupName;
            this.canSign = canSign;
        }
    }
}
