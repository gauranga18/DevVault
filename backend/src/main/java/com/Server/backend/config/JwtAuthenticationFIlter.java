package com.Server.backend.config;

import com.Server.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;

@Component
public class JwtAuthenticationFIlter {
private final HandlerExceptionResolver handlerExceptionResolver;
private final JwtService jwtService;
private final UserDetailsService userDetailsService;
public JwtAuthenticationFIlter(
        JwtService jwtService,
        UserDetailsService userDetailsService,
        HandlerExceptionResolver handlerExceptionResolver){
this.jwtService = jwtService;
this.userDetailsService = userDetailsService;
this.handlerExceptionResolver = handlerExceptionResolver;
}
@Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
        ){
final String authHeader = request.getHeader("Authorization");
}
}
