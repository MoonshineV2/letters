package com.example.letters.repository;

import com.example.letters.model.Workgroup;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class WorkgroupRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Workgroup> findAll() {
        return entityManager.createQuery("SELECT w FROM Workgroup w ORDER BY w.id ASC", Workgroup.class).getResultList();
    }

    public Workgroup create(Workgroup workgroup) {
        entityManager.persist(workgroup);
        return workgroup;
    }
}
