package com.example.letters.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LetterFilters {

    int numberIVC;
    String documentNumber;
    int easdNumber;
    Date registrationDateBegin;
    Date registrationDateEnd;
    List<Integer> originAndAddressIds;
    List<Integer> signerIds;
    List<Integer> executorIds;
    List<Integer> tagIds;
}
