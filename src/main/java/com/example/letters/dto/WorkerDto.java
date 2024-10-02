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
    boolean canSign;

    public static WorkerDto fromWorker(Worker worker) {
        return new WorkerDto(
                worker.getId(),
                worker.getFullName(),
                worker.getInitials(),
                worker.getPost(),
                worker.getWorkgroup() != null ? worker.getWorkgroup().getId() : 0,
                worker.isCanSign()
        );
    }

    public Worker toWorker() {
        return new Worker(
                id,
                fullName,
                initials,
                post,
                workgroupId == 0 ? null : new Workgroup(workgroupId),
                canSign
        );
    }
}
