package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.StudentSuggestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSuggestionRepository extends MongoRepository<StudentSuggestion, String> {
    List<StudentSuggestion> findByEventIdOrderByUpvotesCountDesc(String eventId);
    List<StudentSuggestion> findByClubIdOrderByUpvotesCountDesc(String clubId);
    List<StudentSuggestion> findByClubIdAndKanbanStatusOrderByCreatedAtDesc(String clubId, String kanbanStatus);
    List<StudentSuggestion> findAllByOrderByUpvotesCountDesc();
}
