package com.example.letters.service;

import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.repository.InputLetterRepository;
import com.example.letters.repository.OutputLetterRepository;
import com.example.letters.util.AnswersChain;
import com.example.letters.util.LetterChain;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Model
public class AnswersChainService {

    @Inject
    private InputLetterRepository inputLetterRepository;
    @Inject
    private OutputLetterRepository outputLetterRepository;

    public AnswersChain getChainByInputLetterId(int id) {
        InputLetter inputLetter =  inputLetterRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Входящее письмо с Id = " + id + " не найдено")
        );

        AnswersChain answersChain = new AnswersChain(LetterChain.create(inputLetter));

        generateChainAfterRoot(answersChain);
        generateChainBeforeRoot(answersChain);
        applyRootStatus(answersChain.getRoot(), InputLetter.class.getSimpleName(), id);

        return answersChain;
    }



    public AnswersChain getChainByOutputLetterId(int id) {
        OutputLetter outputLetter =  outputLetterRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Исходящее письмо с Id = " + id + " не найдено")
        );

        AnswersChain answersChain = new AnswersChain(LetterChain.create(outputLetter));

        generateChainAfterRoot(answersChain);
        generateChainBeforeRoot(answersChain);
        applyRootStatus(answersChain.getRoot(), OutputLetter.class.getSimpleName(), id);

        return answersChain;
    }

    private void generateChainAfterRoot(AnswersChain answersChain) {
        LetterChain last = answersChain.getRoot();
        while (true) {
            if (last.getType().equals(InputLetter.class.getSimpleName())) {
                Optional<InputLetter> il = inputLetterRepository.findById(last.getId());

                if (il.isEmpty()) break;
                if (!il.get().isAnswer()) break;

                last.setNext(LetterChain.create(il.get().getOutputLetter()));
                answersChain.setRoot(last.getNext());
            }
            else if (last.getType().equals(OutputLetter.class.getSimpleName())) {
                Optional<OutputLetter> ol = outputLetterRepository.findById(last.getId());

                if (ol.isEmpty()) break;
                if (!ol.get().isAnswer()) break;

                last.setNext(LetterChain.create(ol.get().getInputLetter()));
                answersChain.setRoot(last.getNext());
            }

            last = last.getNext();
        }

    }

    private void generateChainBeforeRoot(AnswersChain answersChain) {
        LetterChain root = answersChain.getRoot();
        generatePreviousChains(root);
    }

    private void generatePreviousChains(LetterChain letterChain) {
        if (letterChain.getType().equals(InputLetter.class.getSimpleName())) {
            List<OutputLetter> previous = outputLetterRepository.findByAnswer(letterChain.getId());
            letterChain.setPrevious(previous.stream().map(LetterChain::create).collect(Collectors.toList()));
        }
        else if (letterChain.getType().equals(OutputLetter.class.getSimpleName())) {
            List<InputLetter> previous = inputLetterRepository.findByAnswer(letterChain.getId());
            letterChain.setPrevious(previous.stream().map(LetterChain::create).collect(Collectors.toList()));
        }

        letterChain.getPrevious().forEach(this::generatePreviousChains);
    }

    private void applyRootStatus(LetterChain letterChain, String letterType, int id) {
        if (letterChain.getType().equals(letterType) && letterChain.getId() == id) {
            letterChain.setRoot(true);
        }
        else {
            if (letterChain.getPrevious() != null) {
                letterChain.getPrevious().forEach(node -> applyRootStatus(node, letterType, id));
            }
        }
    }
}