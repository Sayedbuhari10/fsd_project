package com.demo.auth;

import com.demo.auth.model.UserAccount;
import com.demo.auth.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(UserAccountRepository repository) {
        return args -> repository.findByUsername("demo.admin")
                .orElseGet(() -> repository.save(new UserAccount(
                        null,
                        "demo.admin",
                        "laragon123",
                        "Demo Admin",
                        "HOME_OWNER"
                )));
    }
}
