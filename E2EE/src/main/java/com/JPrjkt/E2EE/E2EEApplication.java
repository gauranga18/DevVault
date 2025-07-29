package com.JPrjkt.E2EE;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class E2EEApplication {

	public static void main(String[] args) {
		SpringApplication.run(E2EEApplication.class, args);
	}
}
