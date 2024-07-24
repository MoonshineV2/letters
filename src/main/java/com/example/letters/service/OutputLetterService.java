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

    public void create(OutputLetter outputLetter) {

        if (outputLetter.getDocumentType().getId() == 0) {
            outputLetter.setDocumentType(null);
        }

        if (outputLetter.getAddress().getId() == 0) {
            throw new RuntimeException("Источник не задан(id = 0)");
        }

        if (outputLetter.getSigner().getId() == 0) {
            throw new RuntimeException("Подписант не задан(id = 0)");
        }

        if (outputLetter.getExecutor().getId() == 0) {
            throw new RuntimeException("Исполнитель не задан(id = 0)");
        }

        if (outputLetter.getTargetParticipant().getId() == 0) {
            throw new RuntimeException("Кому расписано не задано(id = 0)");
        }

        outputLetter.setYear(LocalDateTime.now().getYear());

        outputLetter.setCreateDate(Timestamp.valueOf(LocalDateTime.now()));
        outputLetterRepository.create(outputLetter);
    }
}
