package com.example.letters.controller;

import com.example.letters.dto.WorkerDto;
import com.example.letters.model.OriginAndAddress;
import com.example.letters.model.Worker;
import com.example.letters.repository.OriginAndAddressRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("originsAndAddresses")
public class OriginAndAddressesController {

    @Inject
    private OriginAndAddressRepository originAndAddressRepository;

    @GET
    @Produces("application/json")
    public List<OriginAndAddress> findAll() {
        return originAndAddressRepository.findAll();
    }
}
