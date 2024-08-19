package com.example.letters.service;

import com.example.letters.model.InputLetter;
import com.example.letters.repository.InputLetterRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Model
public class InputLetterService {
    @Inject
    private InputLetterRepository inputLetterRepository;

    public int getActualNumberIVC() {
        List<InputLetter> inputLetters = inputLetterRepository.findAll();
        return inputLetters.stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .max(Comparator.comparing(InputLetter::getNumberIVC))
                .map(el -> el.getNumberIVC() + 1)
                .orElse(1);
    }

    public InputLetter findById(int id) {
        InputLetter inputLetter = inputLetterRepository.findById(id)
                .orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));

        return inputLetter;
    }

    public void create(InputLetter inputLetter) {

        if (inputLetter.getDocumentType().getId() == 0) {
            inputLetter.setDocumentType(null);
        }

        if (inputLetter.getOrigin().getId() == 0) {
            throw new RuntimeException("Источник не задан(id = 0)");
        }

        if (inputLetter.getSigner().getId() == 0) {
            throw new RuntimeException("Подписант не задан(id = 0)");
        }

        if (inputLetter.getExecutor().getId() == 0) {
            throw new RuntimeException("Исполнитель не задан(id = 0)");
        }

        if (inputLetter.getTargetWorker().getId() == 0) {
            throw new RuntimeException("Кому расписано не задано(id = 0)");
        }

        if (inputLetter.isAnswer()) {
            if (inputLetter.getOutputLetter() == null) {
                throw new RuntimeException("Ответное письмо не выбрано");
            }
            if (inputLetter.getOutputLetter().getId() == 0) {
                throw new RuntimeException("Ответное письмо не выбрано");
            }
        }
        else {
            inputLetter.setOutputLetter(null);
        }

        List<InputLetter> list = inputLetterRepository.findAll().stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .collect(Collectors.toList());

        boolean contains = list.stream()
                .map(InputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, inputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + inputLetter.getNumberIVC() + "\" уже существует в базе данных");
        }

        inputLetter.setYear(LocalDateTime.now().getYear());

        inputLetter.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));
        inputLetterRepository.create(inputLetter);
    }
}
