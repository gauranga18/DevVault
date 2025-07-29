package com.JPrjkt.E2EE;

import com.fasterxml.jackson.annotation.JsonTypeId;

@Entity
@Table(name  = "users")

public class User {
    @Id
    @GeneratedValue(streategy = GenerationType.IDENTITY)
}
