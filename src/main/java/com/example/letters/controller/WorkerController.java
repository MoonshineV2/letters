package com.example.letters.controller;

import com.example.letters.dto.WorkerDto;
import com.example.letters.model.Worker;
import com.example.letters.service.WorkerService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import java.util.List;
import java.util.stream.Collectors;

@Path("api/workers")
public class WorkerController {
    @Inject
    private WorkerService workerService;

    @GET
    @Path("{id}")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public WorkerDto findWorker(@PathParam("id") Long id) {
        Worker worker = workerService.findById(id);

        return WorkerDto.fromWorker(worker);
    }

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<WorkerDto> getAllActive() {
        List<WorkerDto> workers = workerService.findAllActive().stream()
                .map(WorkerDto::fromWorker)
                .collect(Collectors.toList());

        return workers;
    }

    @GET
    @Path("withDisabled")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<WorkerDto> getAll() {
        List<WorkerDto> workers = workerService.findAll().stream()
                .map(WorkerDto::fromWorker)
                .collect(Collectors.toList());

        return workers;
    }

    @GET
    @Path("signers")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<WorkerDto> getSigners() {
        return workerService.findSigners().stream()
                .map(WorkerDto::fromWorker)
                .collect(Collectors.toList());
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public WorkerDto createWorker(WorkerDto workerDto) {
        Worker worker = workerService.create(workerDto.toWorker());

        return WorkerDto.fromWorker(worker);
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public WorkerDto update(WorkerDto workerDto) {
        Worker out = workerService.update(workerDto.toWorker());
        return WorkerDto.fromWorker(out);
    }
}