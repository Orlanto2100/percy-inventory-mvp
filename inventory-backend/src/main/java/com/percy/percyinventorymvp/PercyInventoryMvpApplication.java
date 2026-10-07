package com.percy.percyinventorymvp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PercyInventoryMvpApplication {

    public static void main(String[] args) {
        SpringApplication.run(PercyInventoryMvpApplication.class, args);
    }
}