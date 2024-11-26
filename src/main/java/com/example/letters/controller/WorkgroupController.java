package com.example.letters.controller;

import com.example.letters.dto.WorkgroupDto;
import com.example.letters.model.Workgroup;
import com.example.letters.service.WorkgroupService;
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
    public List<WorkgroupDto> getAll() {
        List<WorkgroupDto> workgroups = workgroupService.findAll().stream()
                .map(WorkgroupDto::fromWorkgroup)
                .collect(Collectors.toList());

        return workgroups;
    }

    @POST
    @Consumes("application/json")
    @Produces("application/json")
    public WorkgroupDto create(Workgroup workgroup) {
        return WorkgroupDto.fromWorkgroup(workgroupService.create(workgroup));
    }
}
