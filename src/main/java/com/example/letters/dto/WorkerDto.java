package com.example.letters.dto;

import com.example.letters.model.Worker;
import lombok.Data;

@Data
public class WorkerDto {
    private long id;
    private String fullName;
    private String initials;
    private String post;
    private long workgroupId;
    private boolean canSign;

    public static WorkerDto fromWorker(Worker worker) {
        WorkerDto workerDto = new WorkerDto();
        workerDto.setId(worker.getId());
        workerDto.setFullName(worker.getFullName());
        workerDto.setInitials(worker.getInitials());
        workerDto.setPost(worker.getPost());
        workerDto.setWorkgroupId(worker.getId());
        workerDto.setCanSign(worker.isCanSign());

        return workerDto;
    }

    public Worker toWorker() {
        Worker worker = new Worker();
        worker.setFullName(getFullName());
        worker.setInitials(getInitials());
        worker.setPost(getPost());
        worker.setCanSign(isCanSign());

        return worker;
    }
}
