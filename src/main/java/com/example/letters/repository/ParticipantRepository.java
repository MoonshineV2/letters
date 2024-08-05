package com.example.letters.repository;

import com.example.letters.model.Participant;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class ParticipantRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<Participant> findAll() {
        return entityManager.createQuery("SELECT oa FROM Participant oa", Participant.class).getResultList();
    }

    public List<Participant> findSigners() {
        return entityManager.createQuery("SELECT oa FROM Participant oa WHERE oa.canSign = true", Participant.class).getResultList();
    }

    public Participant create(Participant participant) {
        entityManager.persist(participant);

        return participant;
    }
}
