package com.example.letters.controller;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.HashMap;
import java.util.Map;

@Path("api/security")
public class SecurityController {

    @Context
    private SecurityContext securityContext;

    @GET
    @Path("isAdmin")
    @Produces("application/json")
    @RolesAllowed({"letters_default", "letters_admin"})
    public Response isAdmin() {
        Map<String, Boolean> json = new HashMap<>();
        if (securityContext.isUserInRole("letters_admin")) {
            json.put("isAdmin", true);
        }
        else {
            json.put("isAdmin", false);
        }

        return Response.ok(json).build();
    }
}
