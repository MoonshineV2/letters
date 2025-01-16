package com.example.letters.util;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnswersChain {

    private LetterChain root;

    public AnswersChain(LetterChain root) {
        this.root = root;
    }

    /*public void addNextAnswer(LetterChain next) {
        last.setNext(next);
        last = next;
    }*/
}
