package com.example.letters.dto;

import com.example.letters.model.Worker;
import com.example.letters.model.Workgroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkerDto {
    int id;
    String fullName;
    String initials;
    String post;
    int workgroupId;
    String workgroupName;
    boolean canSign;
    boolean disabled;

    public static WorkerDto fromWorker(Worker worker) {

        return new WorkerDto(
                worker.getId(),
                worker.getFullName(),
                worker.getInitials(),
                worker.getPost(),
                worker.getWorkgroup() != null ? worker.getWorkgroup().getId() : 0,
                worker.getWorkgroup() != null ? worker.getWorkgroup().getName() : null,
                worker.isCanSign(),
                worker.isDisabled()
        );
    }

    public Worker toWorker() {
        Workgroup workgroup = null;
        if (workgroupId > 0) {
            workgroup = new Workgroup(workgroupId);
            workgroup.setName(workgroupName);
        }
        return new Worker(
                id,
                fullName,
                initials,
                post,
                workgroup,
                canSign,
                disabled
        );
    }
}
