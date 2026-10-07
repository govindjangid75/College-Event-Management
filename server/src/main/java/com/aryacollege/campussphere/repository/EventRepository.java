package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    Optional<Event> findBySlug(String slug);
    List<Event> findByVenueIdAndStatusIn(String venueId, List<String> statuses);
    List<Event> findByClubId(String clubId);
    List<Event> findByStatus(String status);
    List<Event> findAllByOrderByStartTimeAsc();
}
