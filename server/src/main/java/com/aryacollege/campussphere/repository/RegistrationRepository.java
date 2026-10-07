package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends MongoRepository<Registration, String> {

    List<Registration> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Registration> findByEventIdOrderByCreatedAtDesc(String eventId);

    List<Registration> findByClubIdOrderByCreatedAtDesc(String clubId);

    Optional<Registration> findByTicketNumber(String ticketNumber);

    Optional<Registration> findByEventIdAndUserId(String eventId, String userId);

    long countByEventId(String eventId);
}
