package com.example.letters.service;

import com.example.letters.model.OriginAndAddress;
import com.example.letters.repository.InputLetterRepository;
import com.example.letters.repository.OriginAndAddressRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;

@Model
public class OriginAndAddressesService {

    @Inject
    private OriginAndAddressRepository originAndAddressRepository;

    public List<OriginAndAddress> findAll() {
        return originAndAddressRepository.findAll();
    }

    public OriginAndAddress create(OriginAndAddress originAndAddress) {
        if (originAndAddress.getName() == null) {
            throw new RuntimeException("Полное наименование не задано");
        }

        if (originAndAddress.getName().isEmpty()) {
            throw new RuntimeException("Полное наименование не задано");
        }

        if (originAndAddress.getShortName() == null) {
            throw new RuntimeException("Краткое наименование не задано");
        }

        if (originAndAddress.getShortName().isEmpty()) {
            throw new RuntimeException("Краткое наименование не задано");
        }

        return originAndAddressRepository.create(originAndAddress);
    }
}
