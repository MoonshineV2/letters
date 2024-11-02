package com.example.letters.service;

import com.example.letters.dto.LetterFilters;
import com.example.letters.model.InputLetter;
import com.example.letters.repository.InputLetterRepository;
import com.example.letters.util.DBFile;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Model
public class InputLetterService {
    @Inject
    private InputLetterRepository inputLetterRepository;

    public List<InputLetter> findAll() {
        inputLetterRepository.findAll().forEach(el -> {
            if (el.getDocumentDate() != null)
                System.out.println(el.getDocumentDate().getTime() + " is " + el.getDocumentDate());
        });
        return inputLetterRepository.findAll();
    }

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

    public List<InputLetter> findByYears(List<Integer> years) {
        return inputLetterRepository.findByYears(years);
    }

    public List<InputLetter> findByFilters(LetterFilters filters) {
        return inputLetterRepository.findByFilters(
                filters.getNumberIVC(),
                filters.getDocumentNumber(),
                filters.getEasdNumber(),
                filters.getOriginAndAddressIds(),
                filters.getSignerIds(),
                filters.getExecutorIds(),
                filters.getRegistrationDateBegin(),
                filters.getRegistrationDateEnd(),
                filters.getTagIds()
        );
    }

    public DBFile getFileById(int id) {
        return inputLetterRepository.getFileById(id).orElseThrow(() ->
                new RuntimeException("Файл для входящего письма с id=" + id + " не найден"));
    }

    public InputLetter create(InputLetter inputLetter) {

        if (inputLetter.getNumberIVC() == 0) {
            throw new RuntimeException("Номер ИВЦ ЖА не задан");
        }

        if (inputLetter.getRegistrationDate() == null) {
            throw new RuntimeException("Дата регистрации не задана");
        }

        if (inputLetter.getPostuplenieDate() == null) {
            throw new RuntimeException("Дата поступления не задана");
        }

        if (inputLetter.getDocumentDate() == null) {
            throw new RuntimeException("Дата письма не задана");
        }

        if (inputLetter.getDocumentNumber().isEmpty()) {
            throw new RuntimeException("Номер письма не задан");
        }

        if (inputLetter.getDocumentName().isEmpty()) {
            throw new RuntimeException("Наименование документа не задано");
        }

        if (inputLetter.getDocumentType() == null) {
            throw new RuntimeException("Тип документа не задан");
        }

        if (inputLetter.getOrigin() == null) {
            throw new RuntimeException("Источник письма не задан");
        }

        if (inputLetter.getSigner() == null) {
            throw new RuntimeException("Подписант письма не задан");
        }

        if (inputLetter.getExecutor() == null) {
            throw new RuntimeException("Исполнитель письма не задан");
        }

        if (inputLetter.getTargetWorker() == null) {
            throw new RuntimeException("\"Кому расписано\" не задано");
        }


        if (inputLetter.isAnswer()) {
            if (inputLetter.getOutputLetter() == null) {
                throw new RuntimeException("Ответное письмо не выбрано");
            }
        }
        else {
            inputLetter.setOutputLetter(null);
        }

        if (inputLetter.getDocumentName() != null && inputLetter.getDocumentName().length() > 100) {
            throw new RuntimeException("Название файла не может быть больше 100 символов");
        }

        if (inputLetter.getTopic() != null && inputLetter.getTopic().length() > 100) {
            throw new RuntimeException("Название темы не может быть больше 100 символов");
        }

        if (inputLetter.getNote() != null && inputLetter.getNote().length() > 500) {
            throw new RuntimeException("Примечание не может быть больше 500 символов");
        }

        inputLetter.setYear(LocalDateTime.now().getYear());
        inputLetter.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));

        List<InputLetter> list = inputLetterRepository.findByYears(List.of(inputLetter.getYear())).stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .collect(Collectors.toList());

        boolean contains = list.stream()
                .map(InputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, inputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + inputLetter.getNumberIVC() + "\" в " + inputLetter.getYear() + " году уже существует в базе данных");
        }

        return inputLetterRepository.create(inputLetter);
    }

    public InputLetter update(InputLetter inputLetter) {
        if (inputLetter.getCreateDate() == null) {
            throw new RuntimeException("Дата регистрации не может быть пустой");
        }

        if (inputLetter.getDocumentName() != null && inputLetter.getDocumentName().length() > 100) {
            throw new RuntimeException("Название файла не может быть больше 100 символов");
        }

        if (inputLetter.getDocumentName() != null && inputLetter.getDocumentName().length() > 100) {
            throw new RuntimeException("Название файла не может быть больше 100 символов");
        }

        if (inputLetter.getTopic() != null && inputLetter.getTopic().length() > 100) {
            throw new RuntimeException("Название темы не может быть больше 100 символов");
        }

        if (inputLetter.getNote() != null && inputLetter.getNote().length() > 500) {
            throw new RuntimeException("Примечание не может быть больше 500 символов");
        }

        List<InputLetter> list = inputLetterRepository.findByYears(List.of(inputLetter.getYear())).stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .collect(Collectors.toList());

        boolean contains = list.stream()
                .map(InputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, inputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + inputLetter.getNumberIVC() + "\" в " + inputLetter.getYear() + " году уже существует в базе данных");
        }

        return inputLetterRepository.update(inputLetter);
    }
}