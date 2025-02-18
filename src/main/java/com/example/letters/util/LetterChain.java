package com.example.letters.util;

import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LetterChain {

    private int id;
    private String type;
    private Date registrationDate;
    private String documentNumber;

    private boolean isRoot;

    private List<LetterChain> previous;
    private LetterChain next;

    public static LetterChain create(InputLetter inputLetter) {
        LetterChain letterChain = new LetterChain();
        letterChain.setId(inputLetter.getId());
        letterChain.setType(inputLetter.getClass().getSimpleName().split("\\$")[0]);
        letterChain.setRegistrationDate(inputLetter.getRegistrationDate());
        letterChain.setDocumentNumber(inputLetter.getDocumentNumber());

        return letterChain;
    }

    public static LetterChain create(OutputLetter outputLetter) {
        LetterChain letterChain = new LetterChain();
        letterChain.setId(outputLetter.getId());
        letterChain.setType(outputLetter.getClass().getSimpleName().split("\\$")[0]);
        letterChain.setRegistrationDate(outputLetter.getRegistrationDate());
        letterChain.setDocumentNumber(String.valueOf(outputLetter.getNumberIVC()));

        return letterChain;
    }

    public void setNext(LetterChain next) {
        this.next = next;
    }
}
