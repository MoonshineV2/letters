package com.example.letters.service;

import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.repository.OutputLetterRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

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

    public void create(OutputLetter outputLetter) {

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

        outputLetter.setYear(LocalDateTime.now().getYear());

        outputLetter.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));
        outputLetterRepository.create(outputLetter);
    }
}
