package com.backend.ecoally.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "questprogresses")
@CompoundIndexes({
    @CompoundIndex(name = "student_quest_period", def = "{'studentId': 1, 'questId': 1, 'periodStart': 1}", unique = true)
})
public class QuestProgress {

    @Id
    private String id;

    private String studentId;
    private String questId;
    private int progress = 0;
    private boolean completed = false;
    private LocalDateTime completedAt;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
