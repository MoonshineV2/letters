package com.example.letters.repository;

import com.example.letters.model.OriginAndAddress;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@Stateless
public class OriginAndAddressRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<OriginAndAddress> findAll() {
        return entityManager.createQuery("SELECT oa FROM OriginAndAddress oa ORDER BY oa.id ASC", OriginAndAddress.class).getResultList();
    }

    public OriginAndAddress create(OriginAndAddress originAndAddress) {
        entityManager.persist(originAndAddress);

        return originAndAddress;
    }

    public OriginAndAddress update(OriginAndAddress originAndAddress) {
        return entityManager.merge(originAndAddress);
    }
}
