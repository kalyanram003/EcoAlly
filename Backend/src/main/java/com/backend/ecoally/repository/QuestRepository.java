package com.backend.ecoally.repository;

import com.backend.ecoally.model.Quest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    List<Quest> findByIsActiveTrue();

    List<Quest> findByType(Quest.QuestType type);

    List<Quest> findByIsActiveTrueAndType(Quest.QuestType type);
}
