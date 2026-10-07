package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.Venue;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VenueRepository extends MongoRepository<Venue, String> {
    Optional<Venue> findByCode(String code);
}
