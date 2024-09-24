package com.example.letters.dto;

import com.example.letters.model.OriginAndAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OriginAndAddressDto {
    private int id;
    private String name;
    private String shortName;
    private int kodADM;

    public static OriginAndAddressDto fromOriginAndAddress(OriginAndAddress oa) {
        return new OriginAndAddressDto(
                oa.getId(),
                oa.getName(),
                oa.getShortName(),
                oa.getKodADM()
        );
    }

    public OriginAndAddress toOriginAndAddress() {
        return new OriginAndAddress(
                id,
                name,
                shortName,
                kodADM
        );
    }
}
