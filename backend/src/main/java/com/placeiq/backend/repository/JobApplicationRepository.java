package com.placeiq.backend.repository;

import com.placeiq.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByUserIdOrderByAppliedOnDescIdDesc(Long userId);

    Optional<JobApplication> findByIdAndUserId(Long id, Long userId);
}