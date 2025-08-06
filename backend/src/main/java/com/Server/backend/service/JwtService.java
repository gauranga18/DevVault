package com.Server.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
@Value("${security.jwt.secret-key}")
    private String secretKey;
@Value("${security.jwt.expiration-time}")
    private long jwtExpiration;
public String extractUsername(String token){
    return extractClaim(token, Claims::getSubject);
}
public<T> T extractClaim(String token, Function<Claims, T> claimsResolver){
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
}
}
