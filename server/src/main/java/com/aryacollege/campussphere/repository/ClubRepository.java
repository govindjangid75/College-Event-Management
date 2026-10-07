package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.Club;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubRepository extends MongoRepository<Club, String> {
    Optional<Club> findBySlug(String slug);
}
