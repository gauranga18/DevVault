package com.JPrjkt.E2EE;

import com.fasterxml.jackson.annotation.JsonTypeId;

@Entity
@Table(name  = "users")

public class User {
    @Id
    @GeneratedValue(streategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    @Column (unique = true)
    private String email;
    private String password;
    private String role = "USER";
}
