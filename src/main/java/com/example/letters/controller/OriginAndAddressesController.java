package com.example.letters.controller;

import com.example.letters.dto.OriginAndAddressDto;
import com.example.letters.model.OriginAndAddress;
import com.example.letters.service.OriginAndAddressesService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("originsAndAddresses")
public class OriginAndAddressesController {

    @Inject
    private OriginAndAddressesService originAndAddressesService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OriginAndAddress> findAllActive() {
        return originAndAddressesService.findAllActive();
    }

    @GET
    @Path("withDisabled")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<OriginAndAddress> findAll() {
        return originAndAddressesService.findAll();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public OriginAndAddressDto create(OriginAndAddressDto originAndAddressDto) {
        OriginAndAddress toReturn = originAndAddressesService.create(originAndAddressDto.toOriginAndAddress());

        return OriginAndAddressDto.fromOriginAndAddress(toReturn);
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public OriginAndAddressDto update(OriginAndAddressDto originAndAddressDto) {
        OriginAndAddress out = originAndAddressesService.update(originAndAddressDto.toOriginAndAddress());
        return OriginAndAddressDto.fromOriginAndAddress(out);
    }
}
