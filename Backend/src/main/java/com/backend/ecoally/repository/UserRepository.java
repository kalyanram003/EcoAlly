package com.ecolearn.repository;

import com.ecolearn.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByUsername(String username);

    @Query("{ '$or': [ {'email': ?0}, {'phone': ?0}, {'username': ?0} ] }")
    Optional<User> findByEmailOrPhoneOrUsername(String identifier);
}
