package com.example.letters.service;

import com.example.letters.dto.LetterFilters;
import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.repository.OutputLetterRepository;
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
public class OutputLetterService {
    @Inject
    private OutputLetterRepository outputLetterRepository;

    public List<OutputLetter> findAll() {
        return outputLetterRepository.findAll();
    }

    public int getActualNumberIVC() {
        List<OutputLetter> outputLetters = outputLetterRepository.findAll();
        return outputLetters.stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .max(Comparator.comparing(OutputLetter::getNumberIVC))
                .map(el -> el.getNumberIVC() + 1)
                .orElse(1);
    }

    public OutputLetter findById(int id) {
        OutputLetter outputLetter = outputLetterRepository.findById(id)
                .orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));

        return outputLetter;
    }

    public List<OutputLetter> findByYears(List<Integer> years) {
        return outputLetterRepository.findByYears(years);
    }

    public List<OutputLetter> findByFilters(LetterFilters filters) {
        return outputLetterRepository.findByFilters(
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
        return outputLetterRepository.getFileById(id).orElseThrow(() ->
                new RuntimeException("Файл для исходящего письма с id=" + id + " не найден"));
    }

    public void create(OutputLetter outputLetter) {

        if (outputLetter.getNumberIVC() == 0) {
            throw new RuntimeException("Номер ИВЦ ЖА не задан");
        }

        if (outputLetter.getEasdNumber() == 0) {
            throw new RuntimeException("Номер ЕАСД не задан");
        }

        if (outputLetter.getRegistrationDate() == null) {
            throw new RuntimeException("Дата регистрации не задана");
        }

        if (outputLetter.getDocumentDate() == null) {
            throw new RuntimeException("Дата письма не задана");
        }

        if (outputLetter.getDocumentNumber() == null || outputLetter.getDocumentNumber().isEmpty()) {
            throw new RuntimeException("Номер письма не задан");
        }

        if (outputLetter.getDocumentType() == null) {
            throw new RuntimeException("Тип документа не задан");
        }

        if (outputLetter.getAddress() == null) {
            throw new RuntimeException("Адрес письма не задан");
        }

        if (outputLetter.getSigner() == null) {
            throw new RuntimeException("Подписант письма не задан");
        }

        if (outputLetter.getExecutor() == null) {
            throw new RuntimeException("Исполнитель письма не задан");
        }

        if (outputLetter.getTargetParticipant() == null) {
            throw new RuntimeException("\"Кому направлено письмо\" не задано");
        }

        if (outputLetter.getTags().isEmpty()) {
            throw new RuntimeException("Ни один тег не выбран");
        }

        if (outputLetter.getTopic() == null || outputLetter.getTopic().isEmpty()) {
            throw new RuntimeException("Тема не расписана");
        }

        if (outputLetter.getNote() == null || outputLetter.getNote().isEmpty()) {
            throw new RuntimeException("Примечание не расписано");
        }

        if (outputLetter.getFile() == null || outputLetter.getFile().length == 0) {
            throw new RuntimeException("Файл для письма не выбран");
        }

        outputLetter.setYear(LocalDateTime.now().getYear());
        outputLetter.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));

        List<OutputLetter> list = outputLetterRepository.findByYears(List.of(outputLetter.getYear())).stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .collect(Collectors.toList());

        boolean contains = list.stream()
                .map(OutputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, outputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + outputLetter.getNumberIVC() + "\" в " + outputLetter.getYear() + " году уже существует в базе данных");
        }

        outputLetterRepository.create(outputLetter);
    }

    public OutputLetter update(OutputLetter outputLetter) {
        if (outputLetter.getDocumentName() != null && outputLetter.getDocumentName().length() > 100) {
            throw new RuntimeException("Название файла не может быть больше 100 символов");
        }

        List<OutputLetter> list = outputLetterRepository.findByYears(List.of(outputLetter.getYear())).stream()
                .filter(el -> el.getYear() == LocalDateTime.now().getYear())
                .collect(Collectors.toList());

        boolean contains = list.stream()
                .map(OutputLetter::getNumberIVC)
                .anyMatch(el -> Objects.equals(el, outputLetter.getNumberIVC()));

        if (contains) {
            throw new RuntimeException("Номер ИВЦ ЖА \"" + outputLetter.getNumberIVC() + "\" в " + outputLetter.getYear() + " году уже существует в базе данных");
        }

        return outputLetterRepository.update(outputLetter);
    }
}
