package com.example.letters.repository;

import com.example.letters.model.OutputLetter;
import com.example.letters.util.DBFile;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;

import java.util.*;

@Stateless
public class OutputLetterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public List<OutputLetter> findAll() {
        return entityManager.createQuery("SELECT ol FROM OutputLetter ol ORDER BY ol.id ASC", OutputLetter.class).getResultList();
    }

    public Optional<OutputLetter> findById(int id) {
        return Optional.ofNullable(entityManager.find(OutputLetter.class, id));
    }
    public List<OutputLetter> findByYears(List<Integer> years) {
        return (List<OutputLetter>) entityManager.createQuery("SELECT ol from OutputLetter ol where ol.year in :years ORDER BY ol.id ASC")
                .setParameter("years", years)
                .getResultList();
    }

    public List<OutputLetter> findByFilters(
            int numberIVC,
            String documentNumber,
            int easdNumber,
            List<Integer> addressIds,
            List<Integer> signerIds,
            List<Integer> executorIds,
            Date registrationDateBegin,
            Date registrationDateEnd,
            List<Integer> tagIds) {

        StringBuilder query = new StringBuilder("SELECT ol from OutputLetter ol");
        boolean whereAppended = false;

        Map<String, Object> parameters = new HashMap<>();

        if (tagIds != null && !tagIds.isEmpty()) {
            query.append(" inner join ol.tags t where t.id in :tagIds");
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

            query.append(" ol.numberIVC = :numberIVC");
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

            query.append(" ol.documentNumber = :documentNumber");
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

            query.append(" ol.easdNumber = :easdNumber");
            parameters.put("easdNumber", easdNumber);
        }

        if (addressIds != null && !addressIds.isEmpty()) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" ol.address.id in :addressIds");
            parameters.put("addressIds", addressIds);
        }

        if (signerIds != null && !signerIds.isEmpty()) {
            if (!whereAppended) {
                query.append(" where");
                whereAppended = true;
            }
            else {
                query.append(" and");
            }

            query.append(" ol.signer.id in :signerIds");
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

            query.append(" ol.executor.id in :executorIds");
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

            query.append(" ol.registrationDate >= :registrationDateBegin");
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

            query.append(" ol.registrationDate <= :registrationDateEnd");
            parameters.put("registrationDateEnd", registrationDateEnd);
        }

        query.append(" ORDER BY ol.id ASC");

        var emQuery = entityManager.createQuery(query.toString());

        for (var pair: parameters.entrySet()) {
            emQuery.setParameter(pair.getKey(), pair.getValue());
        }

        return (List<OutputLetter>) emQuery.getResultList();
    }

    public Optional<DBFile> getFileById(int id) {
        Tuple tuple = entityManager
                .createQuery("select ol.documentName as fileName, ol.file as file from OutputLetter ol where ol.id = :id ORDER BY ol.id ASC", Tuple.class)
                .setParameter("id", id)
                .getSingleResult();

        DBFile dbFile = new DBFile((String) tuple.get(0),(byte[]) tuple.get(1));
        if (dbFile.fileName == null || dbFile.file.length == 0) {
            return Optional.empty();
        }

        return Optional.of(dbFile);
    }

    public OutputLetter create(OutputLetter outputLetter) {
        entityManager.persist(outputLetter);
        return outputLetter;
    }

    public OutputLetter update(OutputLetter outputLetter) {
        return entityManager.merge(outputLetter);
    }
}
