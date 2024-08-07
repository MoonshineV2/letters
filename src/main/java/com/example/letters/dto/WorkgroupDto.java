package com.example.letters.dto;

import com.example.letters.model.Workgroup;
import lombok.Data;

@Data
public class WorkgroupDto {

    private int id;

    private String name;

    private int leaderId;

    public static WorkgroupDto fromWorkgroup(Workgroup workgroup) {
        WorkgroupDto workgroupDto = new WorkgroupDto();
        workgroupDto.id = workgroup.getId();
        workgroupDto.name = workgroup.getName();
        workgroupDto.leaderId = workgroup.getLeader().getId();

        return workgroupDto;
    }
}
