package com.example.letters.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcelExportData {

    String filename;
    List<String> headerRow;
    List<List<String>> dataRows;
}
