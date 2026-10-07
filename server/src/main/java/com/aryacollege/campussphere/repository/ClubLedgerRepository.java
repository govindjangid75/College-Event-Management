package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.ClubLedgerEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClubLedgerRepository extends MongoRepository<ClubLedgerEntry, String> {
    List<ClubLedgerEntry> findByClubIdOrderByTimestampDesc(String clubId);
}
