package com.Server.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

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
public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails){
    return buildToken(extraClaims, userDetails, jwtExpiration);
}
public long getExpirationTime(){
    return jwtExpiration;
}
private String buildToken(
        Map<String, Object> extraClaims,
        UserDetails userDetails,
        long expiration
){
    return JWTs
            .builder()
            .setClaims(extraClaims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date(system.currentTimeMills()))
            .setExpiration(new Date(system.currentTimeInMills()))
            .signWith(getSignInKey(), signatureAlgorithm.ES256)
            .compact();
}
public boolean isTokenValid(){
final String username = extractUsername(token);
return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
}
private boolean isTokenExpired(String token){
return extractExpiration(token).before(new Date());
}
private Date extractExpiration(String token){
    return extractClaim(token, Claims::getExpiration);
}
private Claims extractAllClaims(String token){
return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
}
}
