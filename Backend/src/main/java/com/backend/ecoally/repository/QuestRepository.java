package com.ecolearn.repository;

import com.ecolearn.model.Quest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuestRepository extends MongoRepository<Quest, String> {
    List<Quest> findByIsActiveTrue();
    List<Quest> findByTypeAndIsActiveTrue(Quest.QuestType type);
}
