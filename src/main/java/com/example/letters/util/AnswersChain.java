package com.example.letters.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AnswersChain {

    private LetterChain root;

    ///private LetterChain last;

    public AnswersChain(LetterChain root) {
        this.root = root;
        //last = root;
    }

    /*public void addNextAnswer(LetterChain next) {
        last.setNext(next);
        last = next;
    }*/
}
