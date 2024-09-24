package com.example.letters.dto;

import com.example.letters.model.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentTypeDto {
    public int id;
    public String name;

    public static DocumentTypeDto fromDocumentType(DocumentType documentType) {
        DocumentTypeDto dto = new DocumentTypeDto();
        dto.id = documentType.getId();
        dto.name = documentType.getName();
        return dto;
    }

    public DocumentType toDocumentType() {
        DocumentType documentType = new DocumentType();
        documentType.setId(id);
        documentType.setName(name);
        return documentType;
    }
}
