package com.example.letters.controller;

import com.example.letters.model.OriginAndAddress;
import com.example.letters.service.OriginAndAddressesService;
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
    public List<OriginAndAddress> findAll() {
        return originAndAddressesService.findAll();
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public Response create(OriginAndAddress originAndAddress) {
        OriginAndAddress toReturn = originAndAddressesService.create(originAndAddress);

        return Response.ok(toReturn).build();
    }
}
