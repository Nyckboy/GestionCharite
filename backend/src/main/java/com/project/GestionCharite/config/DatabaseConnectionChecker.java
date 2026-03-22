package com.project.GestionCharite.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConnectionChecker implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseConnectionChecker(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        System.out.println("⏳ Testing database connection...");
        try {
            // A simple query to check if the database responds
            jdbcTemplate.execute("SELECT 1");
            System.out.println("✅ SUCCESS: Connected to Supabase PostgreSQL!");
        } catch (Exception e) {
            System.err.println("❌ ERROR: Failed to connect to the database.");
            System.err.println("Reason: " + e.getMessage());
        }
    }
}