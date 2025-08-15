package com.Server.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

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
}
