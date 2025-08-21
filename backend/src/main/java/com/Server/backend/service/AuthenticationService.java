package com.Server.backend.service;

import com.Server.backend.dto.LoginUserDto;
import com.Server.backend.dto.RegisterUserDto;
import com.Server.backend.dto.VerifyUserDto;
import com.Server.backend.model.User;
import com.Server.backend.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

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
public User authenticate(LoginUserDto input){
User user = userRepository.findByEmail(input, getEmail())
        .orElseThrow(()-> new RuntimeException("User Not Found"));
if(!user.isEnabled()){
throw new RuntimeException("Account Not Verified. Please verify your account");
}authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
                input.getEmail(),
                input.getPassword()
        )
    );
return user;
}
public void verifyUser(VerifyUserDto input){
    Optional<User> optionalUser = userRepository.findByEmail(input.getEmail());
    if(optionalUser.isPresent()){
        User user = optionalUser.get();
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("Verification Code Expired");
        }
        if (user.getVerificationCode().equals(input.getVerificationCode())){
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
        }
        else {
            throw new RuntimeException("Invalid Verification Code");
        }
    }else {
        throw new RuntimeException("User Not Found");
    }
}
}
