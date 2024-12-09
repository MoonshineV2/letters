package com.example.letters.service;

import com.example.letters.dto.ExcelExportData;
import jakarta.enterprise.inject.Model;
import org.apache.poi.common.usermodel.HyperlinkType;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFHyperlink;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.*;

@Model
public class ExcelExporterService {

    public ByteArrayOutputStream tableToExcel(ExcelExportData data) {
        Workbook workbook = new XSSFWorkbook();
        CreationHelper createHelper = workbook.getCreationHelper();

        Sheet sheet = workbook.createSheet("Таблица");

        Row header = sheet.createRow(0);

        CellStyle headerStyle = workbook.createCellStyle();
        XSSFFont font = ((XSSFWorkbook) workbook).createFont();
        font.setFontName("Arial");
        font.setFontHeightInPoints((short) 14);
        font.setBold(true);
        headerStyle.setFont(font);
        headerStyle.setBorderTop(BorderStyle.MEDIUM);
        headerStyle.setBorderBottom(BorderStyle.MEDIUM);
        headerStyle.setBorderLeft(BorderStyle.MEDIUM);
        headerStyle.setBorderRight(BorderStyle.MEDIUM);

        for (int i = 0; i < data.getHeaderRow().size(); i++) {
            Cell headerCell = header.createCell(i);
            headerCell.setCellValue(data.getHeaderRow().get(i));
            headerCell.setCellStyle(headerStyle);
        }

        // Изменение ширины столбцов
        for (int i = 0; i < data.getHeaderRow().size(); i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, sheet.getColumnWidth(i) + 500);
            //System.out.println(sheet.getColumnWidth(i));
        }

        CellStyle dataStyle = workbook.createCellStyle();
        XSSFFont dataFont = ((XSSFWorkbook) workbook).createFont();
        dataFont.setFontName("Arial");
        dataFont.setFontHeightInPoints((short) 14);
        dataStyle.setFont(dataFont);
        dataStyle.setBorderTop(BorderStyle.MEDIUM);
        dataStyle.setBorderBottom(BorderStyle.MEDIUM);
        dataStyle.setBorderLeft(BorderStyle.MEDIUM);
        dataStyle.setBorderRight(BorderStyle.MEDIUM);

        CellStyle hlinkstyle = workbook.createCellStyle();
        XSSFFont hlinkfont = ((XSSFWorkbook)workbook).createFont();
        hlinkfont.setUnderline(XSSFFont.U_SINGLE);
        hlinkfont.setColor(IndexedColors.BLUE.index);
        hlinkfont.setFontName("Arial");
        hlinkfont.setFontHeightInPoints((short) 14);
        hlinkstyle.setFont(hlinkfont);
        hlinkstyle.setBorderTop(BorderStyle.MEDIUM);
        hlinkstyle.setBorderBottom(BorderStyle.MEDIUM);
        hlinkstyle.setBorderLeft(BorderStyle.MEDIUM);
        hlinkstyle.setBorderRight(BorderStyle.MEDIUM);

        for (int i = 0; i < data.getDataRows().size(); i++) {
            Row row = sheet.createRow(i+1);
            for (int j = 0; j < data.getDataRows().get(i).size(); j++) {
                Cell cell = row.createCell(j);

                if (data.getDataRows().get(i).get(j).startsWith("http://") || data.getDataRows().get(i).get(j).startsWith("https://")) {
                    cell.setCellValue("Ссылка");
                    XSSFHyperlink link = (XSSFHyperlink)createHelper.createHyperlink(HyperlinkType.URL);
                    link.setAddress(data.getDataRows().get(i).get(j));
                    cell.setHyperlink(link);
                    cell.setCellStyle(hlinkstyle);
                }
                else {
                    cell.setCellValue(data.getDataRows().get(i).get(j));
                    cell.setCellStyle(dataStyle);
                }
            }
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            workbook.write(outputStream);
            workbook.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return outputStream;
    }

}
