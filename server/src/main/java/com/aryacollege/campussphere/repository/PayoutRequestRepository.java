package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.PayoutSettlementRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutRequestRepository extends MongoRepository<PayoutSettlementRequest, String> {
    List<PayoutSettlementRequest> findByClubIdOrderByRequestedAtDesc(String clubId);
    List<PayoutSettlementRequest> findByStatusOrderByRequestedAtDesc(String status);
}
