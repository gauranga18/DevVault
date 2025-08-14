package com.Server.backend.config;

import com.Server.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
public class ApplicationConfiguration {
private final UserRepository userRepository;
public ApplicationConfiguration(UserRepository userRepository){
    this.userRepository = userRepository;
}
@Bean
    UserDetailsService userDetailsService(){
    return username -> userRepository.findByEmail(username)
            .orElseThrow(()-> new UsernameNotFoundException("User Not Found"))
}
}
