package com.example.letters.controller;

import com.example.letters.dto.WorkerDto;
import com.example.letters.model.Worker;
import com.example.letters.repository.WorkerRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("workers")
public class WorkerController {
    @Inject
    private WorkerRepository workerRepository;

    @GET
    @Path("{id}")
    @Produces("application/json")
    public WorkerDto findWorker(@PathParam("id") Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new WebApplicationException(Response.Status.NOT_FOUND));

        return WorkerDto.fromWorker(worker);
    }
}