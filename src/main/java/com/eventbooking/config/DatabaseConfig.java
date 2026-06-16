package com.eventbooking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.trim().isEmpty()) {
            String url = System.getenv("JDBC_DATABASE_URL");
            if (url == null) {
                url = "jdbc:postgresql://localhost:5432/event_booking";
            }
            String username = System.getenv("DATABASE_USERNAME");
            if (username == null) {
                username = "postgres";
            }
            String password = System.getenv("DATABASE_PASSWORD");
            if (password == null) {
                password = "postgres";
            }
            return DataSourceBuilder.create()
                    .url(url)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        }

        try {
            // Parse URI: postgresql://username:password@host:port/database
            URI uri = new URI(databaseUrl);
            String userInfo = uri.getUserInfo();
            String username = "";
            String password = "";
            if (userInfo != null && userInfo.contains(":")) {
                String[] parts = userInfo.split(":", 2);
                username = parts[0];
                password = parts[1];
            }
            
            String host = uri.getHost();
            int port = uri.getPort();
            if (port == -1) {
                port = 5432; // Default PostgreSQL port
            }
            String path = uri.getPath();
            
            String dbUrl = "jdbc:postgresql://" + host + ":" + port + path;
            
            return DataSourceBuilder.create()
                    .url(dbUrl)
                    .username(username)
                    .password(password)
                    .driverClassName("org.postgresql.Driver")
                    .build();
        } catch (URISyntaxException | NullPointerException e) {
            throw new RuntimeException("Failed to parse DATABASE_URL environment variable: " + databaseUrl, e);
        }
    }
}
