package com.JPrjkt.E2EE;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // This generates getters, setters, toString, equals, hashCode
 // Default constructor
@AllArgsConstructor // Constructor with all fields (optional, for testing or DTOs)

@Entity
@Table(name = "users")
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true)
    private String email;
        public User() {

        }
    private String password;

    private String role = "USER";
}
