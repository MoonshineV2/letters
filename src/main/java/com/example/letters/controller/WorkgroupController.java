package com.example.letters.controller;

import com.example.letters.dto.WorkgroupDto;
import com.example.letters.repository.WorkgroupRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;

import java.util.List;
import java.util.stream.Collectors;

@Path("workgroups")
public class WorkgroupController {

    @Inject
    private WorkgroupRepository workgroupRepository;

    @GET
    @Produces("application/json")
    public List<WorkgroupDto> getAll() {
        List<WorkgroupDto> workgroups = workgroupRepository.findAll().stream()
                .map(WorkgroupDto::fromWorkgroup)
                .collect(Collectors.toList());

        return workgroups;
    }
}
