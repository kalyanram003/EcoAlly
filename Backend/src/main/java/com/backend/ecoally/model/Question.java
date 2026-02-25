package com.backend.ecoally.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "quiz_questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(columnDefinition = "TEXT")
    private String text;

    private String option0;
    private String option1;
    private String option2;
    private String option3;

    private int correctAnswer; // 0-3

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "question_order")
    private int questionOrder;

    // Convenience method to get options as List (for existing service code)
    @Transient
    public List<String> getOptions() {
        return List.of(
                option0 != null ? option0 : "",
                option1 != null ? option1 : "",
                option2 != null ? option2 : "",
                option3 != null ? option3 : "");
    }

    public void setOptions(List<String> opts) {
        if (opts != null && opts.size() >= 4) {
            this.option0 = opts.get(0);
            this.option1 = opts.get(1);
            this.option2 = opts.get(2);
            this.option3 = opts.get(3);
        }
    }
}
