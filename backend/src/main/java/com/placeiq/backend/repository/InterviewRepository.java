package com.placeiq.backend.repository;

import com.placeiq.backend.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByUserIdOrderByInterviewAtAsc(Long userId);

    Optional<Interview> findByIdAndUserId(Long id, Long userId);
}