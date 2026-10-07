package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.VerifiedFeedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerifiedFeedbackRepository extends MongoRepository<VerifiedFeedback, String> {
    List<VerifiedFeedback> findByEventIdOrderByCreatedAtDesc(String eventId);
    List<VerifiedFeedback> findByClubIdOrderByCreatedAtDesc(String clubId);
    List<VerifiedFeedback> findByUserIdOrderByCreatedAtDesc(String userId);
    Optional<VerifiedFeedback> findByEventIdAndUserId(String eventId, String userId);
}
