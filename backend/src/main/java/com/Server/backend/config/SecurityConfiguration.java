package com.Server.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {
private final AuthenticationProvider authenticationProvider;
private final JwtAuthenticationFIlter jwtAuthenticationFIlter;
public SecurityConfiguration(
        JwtAuthenticationFIlter jwtAuthenticationFIlter,
        AuthenticationProvider authenticationProvider
){
    this.authenticationProvider = authenticationProvider;
    this.jwtAuthenticationFIlter = jwtAuthenticationFIlter;
}
@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)throws  Exception{
    http
            .csrf(csrf->csrf.disable())
            .authorizeHttpRequests(authorize->authorize
                    .requestMatchers("/auth/**").permitAll()
                    .anyRequest().authenticated()
            )
            .sessionManagement(session->session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFIlter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
@Bean
    public CorsConfigurationSource corsConfigurationSource(){
    CorsConfiguration corsConfiguration = new CorsConfiguration();
    corsConfiguration.setAllowedOrigins(List.of());
}

}
