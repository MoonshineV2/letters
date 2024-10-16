package com.example.letters.repository;

import com.example.letters.model.InputLetter;
import com.example.letters.util.DBFile;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;

import java.util.List;
import java.util.Optional;

@Stateless
public class InputLetterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<InputLetter> findAll() {
        return entityManager.createQuery("SELECT il FROM InputLetter il", InputLetter.class).getResultList();
    }

    public Optional<InputLetter> findById(int id) {
        return Optional.ofNullable(entityManager.find(InputLetter.class, id));
    }

    public Optional<InputLetter> findByIdNoFile(int id) {
        return Optional.of((InputLetter) entityManager
                .createQuery("select il from InputLetter il where il.id = :id")
                .setParameter("id", id)
                .getSingleResult());
    }

    public List<InputLetter> findByYears(List<Integer> years) {
        return (List<InputLetter>) entityManager.createQuery("SELECT il from InputLetter il where il.year in :years")
                .setParameter("years", years)
                .getResultList();
    }

    public Optional<DBFile> getFileById(int id) {
        Tuple tuple = entityManager
                .createQuery("select il.documentName as fileName, il.file as file from InputLetter il where il.id = :id", Tuple.class)
                .setParameter("id", id)
                .getSingleResult();

        DBFile dbFile = new DBFile((String) tuple.get(0),(byte[]) tuple.get(1));

        return Optional.of(dbFile);
    }
    public InputLetter create(InputLetter inputLetter) {
        entityManager.persist(inputLetter);
        return inputLetter;
    }

    public InputLetter update(InputLetter inputLetter) {
        return entityManager.merge(inputLetter);
    }
}
