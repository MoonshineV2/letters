package com.example.letters.service;

import com.example.letters.model.Tag;
import com.example.letters.repository.TagRepository;
import jakarta.enterprise.inject.Model;
import jakarta.inject.Inject;

import java.util.List;

@Model
public class TagService {

    @Inject
    private TagRepository tagRepository;

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Tag create(Tag tag) {

        if (tag.getText() == null || tag.getText().isEmpty()) {
            throw new IllegalArgumentException("Название тега не задано");
        }

        return tagRepository.create(tag);
    }

    public Tag update(Tag tag) {

        if (tag.getText() == null || tag.getText().isEmpty()) {
            throw new IllegalArgumentException("Название тега не задано");
        }

        return tagRepository.update(tag);
    }
}
