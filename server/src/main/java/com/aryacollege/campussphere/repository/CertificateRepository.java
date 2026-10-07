package com.aryacollege.campussphere.repository;

import com.aryacollege.campussphere.model.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    List<Certificate> findByUserIdOrderByIssuedAtDesc(String userId);
    List<Certificate> findByEventIdOrderByIssuedAtDesc(String eventId);
    Optional<Certificate> findByCertificateId(String certificateId);
    Optional<Certificate> findByVerificationHash(String verificationHash);
    Optional<Certificate> findByEventIdAndUserId(String eventId, String userId);
}
