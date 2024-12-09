package com.example.letters.dto;

import com.example.letters.model.Worker;
import com.example.letters.model.Workgroup;
import lombok.Data;

@Data
public class WorkgroupDto {

    private int id;

    private String name;

    private int leaderId;
    private String leaderName;

    public static WorkgroupDto fromWorkgroup(Workgroup workgroup) {
        WorkgroupDto workgroupDto = new WorkgroupDto();
        workgroupDto.id = workgroup.getId();
        workgroupDto.name = workgroup.getName();
        if (workgroup.getLeader() != null) {
            workgroupDto.leaderId = workgroup.getLeader().getId();
            workgroupDto.leaderName = workgroup.getLeader().getFullName();
        }

        return workgroupDto;
    }

    public Workgroup toWorkgroup() {
        Worker worker = null;
        if (leaderId > 0) {
            worker = new Worker(leaderId);
            worker.setFullName(leaderName);
        }
        return new Workgroup(id, name, worker);
    }
}
