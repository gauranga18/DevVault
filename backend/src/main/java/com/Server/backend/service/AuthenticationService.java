package com.Server.backend.service;

import com.Server.backend.dto.RegisterUserDto;
import com.Server.backend.model.User;
import com.Server.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {
private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final AuthenticationManager authenticationManager;
private final EmailService emailService;
public AuthenticationService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        EmailService emailService
){
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.emailService = emailService;
}
public User signup(RegisterUserDto input){
User user = new User(input.getUsername(),input.getEmail(),passwordEncoder.encode(input.getPassword()));
user.setVerificationCode(generateVerificationCode());
user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
user.setEnabled(false);
sendVerificationEmail(user);
return userRepository.save(user);
}
}
