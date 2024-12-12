package com.example.letters.dto;

import com.example.letters.model.OriginAndAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OriginAndAddressDto {
    int id;
    String name;
    String shortName;
    int kodADM;
    boolean disabled;

    public static OriginAndAddressDto fromOriginAndAddress(OriginAndAddress oa) {
        return new OriginAndAddressDto(
                oa.getId(),
                oa.getName(),
                oa.getShortName(),
                oa.getKodADM(),
                oa.isDisabled()
        );
    }

    public OriginAndAddress toOriginAndAddress() {
        return new OriginAndAddress(
                id,
                name,
                shortName,
                kodADM,
                disabled
        );
    }
}
