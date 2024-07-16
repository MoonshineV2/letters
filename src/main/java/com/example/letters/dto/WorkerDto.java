package com.example.letters.dto;

import com.example.letters.model.Worker;
import com.example.letters.model.Workgroup;

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

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getInitials() {
        return initials;
    }

    public void setInitials(String initials) {
        this.initials = initials;
    }

    public String getPost() {
        return post;
    }

    public void setPost(String post) {
        this.post = post;
    }

    public long getWorkgroupId() {
        return workgroupId;
    }

    public void setWorkgroupId(long workgroupId) {
        this.workgroupId = workgroupId;
    }

    public boolean isCanSign() {
        return canSign;
    }

    public void setCanSign(boolean canSign) {
        this.canSign = canSign;
    }
}
