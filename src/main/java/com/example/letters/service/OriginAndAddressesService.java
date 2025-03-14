package com.example.letters.service;

import com.example.letters.model.OriginAndAddress;
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

    public List<OriginAndAddress> findAllActive() {
        return originAndAddressRepository.findAllActive();
    }

    public OriginAndAddress create(OriginAndAddress originAndAddress) {

        if (originAndAddress.getShortName() == null || originAndAddress.getShortName().isEmpty()) {
            throw new IllegalArgumentException("Краткое наименование не задано");
        }

        if (originAndAddress.getKodADM() == 0) {
            throw new IllegalArgumentException("Код администрации не задан");
        }

        return originAndAddressRepository.create(originAndAddress);
    }

    public OriginAndAddress update(OriginAndAddress originAndAddress) {

        if (originAndAddress.getShortName() == null || originAndAddress.getShortName().isEmpty()) {
            throw new IllegalArgumentException("Краткое наименование не задано");
        }

        if (originAndAddress.getKodADM() == 0) {
            throw new IllegalArgumentException("Код администрации не задан");
        }

        return originAndAddressRepository.update(originAndAddress);
    }
}
