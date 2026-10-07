package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.ClubApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubApplicationRepository extends MongoRepository<ClubApplication, String> {
    List<ClubApplication> findByClubIdOrderByAppliedAtDesc(String clubId);
    List<ClubApplication> findByUserIdOrderByAppliedAtDesc(String userId);
}
