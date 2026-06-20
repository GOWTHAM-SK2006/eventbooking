package com.eventbooking.config;

import com.eventbooking.entity.Role;
import com.eventbooking.entity.User;
import com.eventbooking.repository.RoleRepository;
import com.eventbooking.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Initialize Roles
            Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_USER");
                return roleRepository.save(role);
            });

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ADMIN");
                return roleRepository.save(role);
            });

            roleRepository.findByName("ROLE_ORGANIZER").orElseGet(() -> {
                Role role = new Role();
                role.setName("ROLE_ORGANIZER");
                return roleRepository.save(role);
            });

            // Initialize Admin User
            if (!userRepository.existsByEmail("admin@123")) {
                User admin = new User();
                admin.setEmail("admin@123");
                admin.setPassword(passwordEncoder.encode("admin"));
                admin.setFirstName("Super");
                admin.setLastName("Admin");
                
                Set<Role> roles = new HashSet<>();
                roles.add(adminRole);
                admin.setRoles(roles);
                
                userRepository.save(admin);
                System.out.println("Admin user created: admin@123 / admin");
            }
        };
    }
}
