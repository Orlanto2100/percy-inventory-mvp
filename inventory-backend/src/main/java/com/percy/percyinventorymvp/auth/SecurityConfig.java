package com.percy.percyinventorymvp.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Authentication
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // Users
                        .requestMatchers("/api/users/**")
                        .hasRole("ADMIN")

                        // Warehouses
                        .requestMatchers("/api/warehouses/**")
                        .hasAnyRole("ADMIN", "WAREHOUSE")

                        // Locations
                        .requestMatchers("/api/locations/**")
                        .hasAnyRole("ADMIN", "WAREHOUSE")

                        // Purchase Orders
                        .requestMatchers("/api/purchase-orders/**")
                        .hasAnyRole("ADMIN", "PURCHASING")

                        // Receipts - viewing
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/receipts/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "PURCHASING",
                                "WAREHOUSE"
                        )

                        // Receipts - receiving goods
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/receipts"
                        )
                        .hasAnyRole("ADMIN", "WAREHOUSE")

                        // Stock Movements
                        .requestMatchers("/api/stock-movements/**")
                        .hasAnyRole("ADMIN", "WAREHOUSE")

                        // Products and Inventory
                        // All authenticated roles can access these.
                        .requestMatchers("/api/products/**")
                        .authenticated()

                        .requestMatchers("/api/inventory/**")
                        .authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}