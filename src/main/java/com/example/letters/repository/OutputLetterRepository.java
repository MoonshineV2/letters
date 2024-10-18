package com.example.letters.repository;

import com.example.letters.model.InputLetter;
import com.example.letters.model.OutputLetter;
import com.example.letters.util.DBFile;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;

import java.util.List;
import java.util.Optional;

@Stateless
public class OutputLetterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<OutputLetter> findAll() {
        return entityManager.createQuery("SELECT ol FROM OutputLetter ol", OutputLetter.class).getResultList();
    }

    public Optional<OutputLetter> findById(int id) {
        return Optional.ofNullable(entityManager.find(OutputLetter.class, id));
    }
    public List<OutputLetter> findByYears(List<Integer> years) {
        return (List<OutputLetter>) entityManager.createQuery("SELECT ol from OutputLetter ol where ol.year in :years")
                .setParameter("years", years)
                .getResultList();
    }

    public Optional<DBFile> getFileById(int id) {
        Tuple tuple = entityManager
                .createQuery("select ol.documentName as fileName, ol.file as file from OutputLetter ol where ol.id = :id", Tuple.class)
                .setParameter("id", id)
                .getSingleResult();

        DBFile dbFile = new DBFile((String) tuple.get(0),(byte[]) tuple.get(1));
        if (dbFile.fileName == null || dbFile.file.length == 0) {
            return Optional.empty();
        }

        return Optional.of(dbFile);
    }

    public void create(OutputLetter outputLetter) {
        entityManager.persist(outputLetter);
    }

    public OutputLetter update(OutputLetter outputLetter) {
        return entityManager.merge(outputLetter);
    }
}
