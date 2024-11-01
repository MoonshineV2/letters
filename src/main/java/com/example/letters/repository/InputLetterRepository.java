package com.example.letters.repository;

import com.example.letters.model.InputLetter;
import com.example.letters.util.DBFile;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;

import java.text.SimpleDateFormat;
import java.util.*;

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

    public List<InputLetter> findByFilters(
            int numberIVC,
            String documentNumber,
            int easdNumber,
            List<Integer> originIds,
            List<Integer> signerIds,
            List<Integer> executorIds,
            Date registrationDateBegin,
            Date registrationDateEnd,
            List<Integer> tagIds) {

        StringBuilder query = new StringBuilder("SELECT il from InputLetter il");
        boolean whereAppended = false;

        Map<String, Object> parameters = new HashMap<>();

        if (tagIds != null && !tagIds.isEmpty()) {
            query.append(" inner join il.tags t where t.id in :tagIds");
            whereAppended = true;
            parameters.put("tagIds", tagIds);
        }

        if (numberIVC > 0) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.numberIVC = :numberIVC");
            parameters.put("numberIVC", numberIVC);
        }

        if (documentNumber != null) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.documentNumber = :documentNumber");
            parameters.put("documentNumber", documentNumber);
        }

        if (easdNumber > 0) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.easdNumber = :easdNumber");
            parameters.put("easdNumber", easdNumber);
        }

        if (originIds != null && !originIds.isEmpty()) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.origin.id in :originIds");
            parameters.put("originIds", originIds);
        }

        if (signerIds != null && !signerIds.isEmpty()) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.signer.id in :signerIds");
            parameters.put("signerIds", signerIds);
        }

        if (executorIds != null && !executorIds.isEmpty()) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.executor.id in :executorIds");
            parameters.put("executorIds", executorIds);
        }

        if (registrationDateBegin != null) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.registrationDate >= :registrationDateBegin");
            parameters.put("registrationDateBegin", registrationDateBegin);
        }

        if (registrationDateEnd != null) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" il.registrationDate <= :registrationDateEnd");
            parameters.put("registrationDateEnd", registrationDateEnd);
        }

        var emQuery = entityManager.createQuery(query.toString());

        for (var pair: parameters.entrySet()) {
            emQuery.setParameter(pair.getKey(), pair.getValue());
        }

        return (List<InputLetter>) emQuery.getResultList();
    }

    public Optional<DBFile> getFileById(int id) {
        Tuple tuple = entityManager
                .createQuery("select il.documentName as fileName, il.file as file from InputLetter il where il.id = :id", Tuple.class)
                .setParameter("id", id)
                .getSingleResult();

        DBFile dbFile = new DBFile((String) tuple.get(0),(byte[]) tuple.get(1));
        if (dbFile.fileName == null || dbFile.file.length == 0) {
            return Optional.empty();
        }

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
