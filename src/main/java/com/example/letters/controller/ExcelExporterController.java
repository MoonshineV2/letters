package com.example.letters.controller;

import com.example.letters.dto.ExcelExportData;
import com.example.letters.service.ExcelExporterService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.*;

@Path("api/excel")
public class ExcelExporterController {

    @Inject
    ExcelExporterService excelExporterService;

    @POST
    @Path("tableToExcel")
    @Consumes("application/json")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response tableToExcel(ExcelExportData exportData) {
        String contentDisposition = "attachment;filename*=utf-8''" + exportData.getFilename() + ".xlsx";
        ByteArrayOutputStream os = excelExporterService.tableToExcel(exportData);

        return Response.ok(os.toByteArray(), MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-Disposition", contentDisposition)
                .build();
    }
}
