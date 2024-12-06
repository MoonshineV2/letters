package com.example.letters.service;

import com.example.letters.model.DocumentType;
import com.example.letters.model.Workgroup;
import com.example.letters.repository.WorkgroupRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;

@Model
public class WorkgroupService {

    @Inject
    private WorkgroupRepository workgroupRepository;

    public List<Workgroup> findAll() {
        return workgroupRepository.findAll();
    }

    public Workgroup create(Workgroup workgroup) {

        if (workgroup.getName() == null || workgroup.getName().isEmpty()) {
            throw new IllegalArgumentException("Название рабочей группы не задано");
        }

        if (workgroup.getLeader() == null) {
            throw new IllegalArgumentException("Руководитель рабочей группы не задан");
        }

        return workgroupRepository.create(workgroup);
    }

    public Workgroup update(Workgroup workgroup) {

        if (workgroup.getName() == null || workgroup.getName().isEmpty()) {
            throw new IllegalArgumentException("Название рабочей группы не задано");
        }

        if (workgroup.getLeader() == null) {
            throw new IllegalArgumentException("Руководитель рабочей группы не задан");
        }

        return workgroupRepository.update(workgroup);
    }

}
