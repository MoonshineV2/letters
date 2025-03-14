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

    public List<InputLetter> findByDates(int year, List<Integer> months) {
        return inputLetterRepository.findByDates(year, months);
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
            throw new IllegalArgumentException("Номер ИВЦ ЖА не задан");
        }

        if (inputLetter.getRegistrationDate() == null) {
            throw new IllegalArgumentException("Дата регистрации не задана");
        }

        if (inputLetter.getPostuplenieDate() == null) {
            throw new IllegalArgumentException("Дата поступления не задана");
        }

        if (inputLetter.getDocumentDate() == null) {
            throw new IllegalArgumentException("Дата письма не задана");
        }

        if (inputLetter.getDocumentNumber() == null || inputLetter.getDocumentNumber().isEmpty()) {
            throw new IllegalArgumentException("Номер письма не задан");
        }

        if (inputLetter.getDocumentType() == null) {
            throw new IllegalArgumentException("Тип документа не задан");
        }

        if (inputLetter.getOrigin() == null) {
            throw new IllegalArgumentException("Источник письма не задан");
        }

        if (inputLetter.getSigner() == null) {
            throw new IllegalArgumentException("Подписант письма не задан");
        }

        if (inputLetter.getExecutor() == null) {
            throw new IllegalArgumentException("Исполнитель письма не задан");
        }

        if (inputLetter.getTargetWorker() == null) {
            throw new IllegalArgumentException("\"Кому расписано\" не задано");
        }

        if (inputLetter.getTags().isEmpty()) {
            throw new IllegalArgumentException("Ни один тег не выбран");
        }

        if (inputLetter.getTopic() == null || inputLetter.getTopic().isEmpty()) {
            throw new IllegalArgumentException("Тема не расписана");
        }

        if (inputLetter.getNote() == null || inputLetter.getNote().isEmpty()) {
            throw new IllegalArgumentException("Примечание не расписано");
        }

        if (inputLetter.getFile() == null || inputLetter.getFile().length == 0) {
            throw new IllegalArgumentException("Файл для письма не выбран");
        }

        if (inputLetter.isAnswer()) {
            if (inputLetter.getOutputLetter() == null) {
                throw new IllegalArgumentException("Ответное письмо не выбрано");
            }
        }
        else {
            inputLetter.setOutputLetter(null);
        }

        if (inputLetter.getDocumentName() != null && inputLetter.getDocumentName().length() > 100) {
            throw new IllegalArgumentException("Название файла не может быть больше 100 символов");
        }

        if (inputLetter.getTopic() != null && inputLetter.getTopic().length() > 100) {
            throw new IllegalArgumentException("Название темы не может быть больше 100 символов");
        }

        if (inputLetter.getNote() != null && inputLetter.getNote().length() > 500) {
            throw new IllegalArgumentException("Примечание не может быть больше 500 символов");
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

        if (inputLetter.getNumberIVC() == 0) {
            throw new IllegalArgumentException("Номер ИВЦ ЖА не задан");
        }

        if (inputLetter.getRegistrationDate() == null) {
            throw new IllegalArgumentException("Дата регистрации не задана");
        }

        if (inputLetter.getPostuplenieDate() == null) {
            throw new IllegalArgumentException("Дата поступления не задана");
        }

        if (inputLetter.getDocumentDate() == null) {
            throw new IllegalArgumentException("Дата письма не задана");
        }

        if (inputLetter.getDocumentNumber() == null || inputLetter.getDocumentNumber().isEmpty()) {
            throw new IllegalArgumentException("Номер письма не задан");
        }

        if (inputLetter.getDocumentType() == null) {
            throw new IllegalArgumentException("Тип документа не задан");
        }

        if (inputLetter.getOrigin() == null) {
            throw new IllegalArgumentException("Источник письма не задан");
        }

        if (inputLetter.getSigner() == null) {
            throw new IllegalArgumentException("Подписант письма не задан");
        }

        if (inputLetter.getExecutor() == null) {
            throw new IllegalArgumentException("Исполнитель письма не задан");
        }

        if (inputLetter.getTargetWorker() == null) {
            throw new IllegalArgumentException("\"Кому расписано\" не задано");
        }

        if (inputLetter.getTags().isEmpty()) {
            throw new IllegalArgumentException("Ни один тег не выбран");
        }

        if (inputLetter.getTopic() == null || inputLetter.getTopic().isEmpty()) {
            throw new IllegalArgumentException("Тема не расписана");
        }

        if (inputLetter.getNote() == null || inputLetter.getNote().isEmpty()) {
            throw new IllegalArgumentException("Примечание не расписано");
        }

        if (inputLetter.getFile() == null || inputLetter.getFile().length == 0) {
            throw new IllegalArgumentException("Файл для письма не выбран");
        }

        if (inputLetter.isAnswer()) {
            if (inputLetter.getOutputLetter() == null) {
                throw new IllegalArgumentException("Ответное письмо не выбрано");
            }
        }
        else {
            inputLetter.setOutputLetter(null);
        }

        if (inputLetter.getDocumentName() != null && inputLetter.getDocumentName().length() > 100) {
            throw new IllegalArgumentException("Название файла не может быть больше 100 символов");
        }

        if (inputLetter.getTopic() != null && inputLetter.getTopic().length() > 100) {
            throw new IllegalArgumentException("Название темы не может быть больше 100 символов");
        }

        if (inputLetter.getNote() != null && inputLetter.getNote().length() > 500) {
            throw new IllegalArgumentException("Примечание не может быть больше 500 символов");
        }

        List<InputLetter> list = inputLetterRepository.findByYears(List.of(inputLetter.getYear()))
                .stream()
                .filter(el -> el.getId() != inputLetter.getId())
                .collect(Collectors.toList()
                );

        boolean contains = list.stream()
                .map(InputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, inputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + inputLetter.getNumberIVC() + "\" в " + inputLetter.getYear() + " году уже существует в базе данных");
        }

        return inputLetterRepository.update(inputLetter);
    }
}