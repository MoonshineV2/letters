package com.example.letters.dto;

import java.util.List;

public class ExcelExportData {

    List<String> columns;
    List<Row> rows;

    private class Row {
        List<String> cell;
    }
}
