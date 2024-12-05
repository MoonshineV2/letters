package com.example.letters.controller;

import com.example.letters.dto.DocumentTypeDto;
import com.example.letters.dto.WorkgroupDto;
import com.example.letters.model.DocumentType;
import com.example.letters.model.Workgroup;
import com.example.letters.service.WorkgroupService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;

import java.util.List;
import java.util.stream.Collectors;

@Path("workgroups")
public class WorkgroupController {

    @Inject
    private WorkgroupService workgroupService;

    @GET
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public List<WorkgroupDto> getAll() {
        List<WorkgroupDto> workgroups = workgroupService.findAll().stream()
                .map(WorkgroupDto::fromWorkgroup)
                .collect(Collectors.toList());

        return workgroups;
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public WorkgroupDto create(WorkgroupDto workgroupDto) {
        Workgroup wg = workgroupService.create(workgroupDto.toWorkgroup());
        return WorkgroupDto.fromWorkgroup(wg);
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    @RolesAllowed({"letters_admin"})
    public WorkgroupDto update(WorkgroupDto workgroupDto) {
        Workgroup out = workgroupService.update(workgroupDto.toWorkgroup());
        return WorkgroupDto.fromWorkgroup(out);
    }
}
