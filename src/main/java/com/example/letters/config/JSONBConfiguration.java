package com.example.letters.config;

import jakarta.annotation.Priority;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.json.bind.config.PropertyNamingStrategy;
import jakarta.json.bind.config.PropertyOrderStrategy;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.ext.ContextResolver;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(Priorities.ENTITY_CODER)
public class JSONBConfiguration implements ContextResolver<Jsonb> {

    private Jsonb jsonb;

    public JSONBConfiguration() {
        JsonbConfig config = new JsonbConfig()
                .withFormatting(true)
                .withNullValues(true)
                .withPropertyNamingStrategy(PropertyNamingStrategy.IDENTITY)
                .withPropertyOrderStrategy(PropertyOrderStrategy.ANY);


        jsonb = JsonbBuilder.create(config);
    }

    @Override
    public Jsonb getContext(Class<?> type) {
        return jsonb;
    }

}