package com.backend.ecoally.config;

import com.backend.ecoally.model.Quest;
import com.backend.ecoally.model.Question;
import com.backend.ecoally.model.Quiz;
import com.backend.ecoally.repository.QuestRepository;
import com.backend.ecoally.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

        private final QuestRepository questRepository;
        private final QuizRepository quizRepository;

        @Bean
        public CommandLineRunner seedData() {
                return args -> {

                        // ── Quests ──────────────────────────────────────────────────────
                        if (questRepository.count() == 0) {
                                List<Quest> quests = List.of(
                                                createQuest("Daily Quiz Champion", "Complete 1 quiz today",
                                                                "🧠", Quest.QuestType.DAILY,
                                                                Quest.QuestAction.COMPLETE_QUIZ,
                                                                1, 50, 10, "bg-blue-100 border-blue-300"),
                                                createQuest("Photo Challenger", "Submit 1 eco photo challenge",
                                                                "📸", Quest.QuestType.DAILY,
                                                                Quest.QuestAction.COMPLETE_CHALLENGE,
                                                                1, 75, 15, "bg-green-100 border-green-300"),
                                                createQuest("Weekly Scholar", "Complete 5 quizzes this week",
                                                                "🎓", Quest.QuestType.WEEKLY,
                                                                Quest.QuestAction.COMPLETE_QUIZ,
                                                                5, 200, 40, "bg-purple-100 border-purple-300"),
                                                createQuest("Eco Warrior", "Submit 3 challenges this week",
                                                                "🌱", Quest.QuestType.WEEKLY,
                                                                Quest.QuestAction.COMPLETE_CHALLENGE,
                                                                3, 300, 60, "bg-emerald-100 border-emerald-300"),
                                                createQuest("Streak Keeper", "Maintain a 7-day streak",
                                                                "🔥", Quest.QuestType.WEEKLY,
                                                                Quest.QuestAction.MAINTAIN_STREAK,
                                                                7, 250, 50, "bg-orange-100 border-orange-300"),
                                                createQuest("Perfect Score", "Score 100% on any quiz",
                                                                "💎", Quest.QuestType.EPIC,
                                                                Quest.QuestAction.COMPLETE_QUIZ,
                                                                1, 500, 100, "bg-yellow-100 border-yellow-300"));
                                questRepository.saveAll(quests);
                                System.out.println("[DataSeeder] ✅ Seeded " + quests.size() + " quests");
                        } else {
                                System.out.println("[DataSeeder] ⏭ Quests already exist — skipping");
                        }

                        // ── Quizzes ─────────────────────────────────────────────────────
                        if (quizRepository.count() == 0) {
                                Quiz quiz1 = new Quiz();
                                quiz1.setTitle("Introduction to Climate Change");
                                quiz1.setDescription("Test your basic knowledge about climate change");
                                quiz1.setTopic("climate-change");
                                quiz1.setDifficulty(Quiz.Difficulty.EASY);
                                quiz1.setTimeLimit(300);
                                quiz1.setPublished(true);
                                // createdBy is null for system-seeded quizzes (Long, no system user ID)

                                List<Question> q1Questions = new ArrayList<>();
                                q1Questions.add(makeQuestion(quiz1,
                                                "What gas is most responsible for the greenhouse effect?",
                                                List.of("Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"), 1,
                                                "CO₂ traps heat in the atmosphere, causing global warming.", 0));
                                q1Questions.add(makeQuestion(quiz1, "What does 'carbon footprint' mean?",
                                                List.of("The size of your shoe",
                                                                "Total greenhouse gas emissions you cause",
                                                                "Carbon tax amount", "Size of a carbon atom"),
                                                1,
                                                "Your carbon footprint is the total amount of greenhouse gases you produce.",
                                                1));
                                q1Questions.add(makeQuestion(quiz1, "Which renewable energy source uses sunlight?",
                                                List.of("Wind power", "Geothermal", "Solar power", "Hydropower"), 2,
                                                "Solar panels convert sunlight directly into electricity.", 2));
                                quiz1.setQuestions(q1Questions);

                                Quiz quiz2 = new Quiz();
                                quiz2.setTitle("Biodiversity & Ecosystems");
                                quiz2.setDescription("Learn about the importance of biodiversity");
                                quiz2.setTopic("biodiversity");
                                quiz2.setDifficulty(Quiz.Difficulty.MEDIUM);
                                quiz2.setTimeLimit(600);
                                quiz2.setPublished(true);

                                List<Question> q2Questions = new ArrayList<>();
                                q2Questions.add(makeQuestion(quiz2, "What is biodiversity?",
                                                List.of("Variety of life on Earth", "A type of plant",
                                                                "A chemical process", "Ocean depth measurement"),
                                                0,
                                                "Biodiversity refers to the variety of all living species on Earth.",
                                                0));
                                q2Questions.add(makeQuestion(quiz2, "Which of these is a major threat to biodiversity?",
                                                List.of("Reforestation", "Habitat destruction",
                                                                "Wildlife sanctuaries", "Organic farming"),
                                                1,
                                                "Habitat destruction is the leading cause of biodiversity loss worldwide.",
                                                1));
                                q2Questions.add(makeQuestion(quiz2, "What is a food chain?",
                                                List.of("A restaurant chain", "Energy transfer between organisms",
                                                                "A type of ecosystem", "A farming method"),
                                                1,
                                                "A food chain shows how energy is transferred from one organism to another.",
                                                2));
                                quiz2.setQuestions(q2Questions);

                                Quiz quiz3 = new Quiz();
                                quiz3.setTitle("Waste Management & Recycling");
                                quiz3.setDescription("Test your knowledge about proper waste management");
                                quiz3.setTopic("waste-management");
                                quiz3.setDifficulty(Quiz.Difficulty.EASY);
                                quiz3.setTimeLimit(300);
                                quiz3.setPublished(true);

                                List<Question> q3Questions = new ArrayList<>();
                                q3Questions.add(makeQuestion(quiz3, "Which bin should glass bottles go in?",
                                                List.of("General waste", "Recycling bin", "Compost bin",
                                                                "Hazardous waste"),
                                                1,
                                                "Glass is fully recyclable and should always go in the recycling bin.",
                                                0));
                                q3Questions.add(makeQuestion(quiz3, "What does the 3R principle stand for?",
                                                List.of("Read, Run, Rest", "Reduce, Reuse, Recycle",
                                                                "Repair, Restore, Renew", "Remove, Replace, Reclaim"),
                                                1,
                                                "The 3Rs — Reduce, Reuse, Recycle — are the foundation of waste management.",
                                                1));
                                q3Questions.add(makeQuestion(quiz3,
                                                "Which material takes the longest to decompose in a landfill?",
                                                List.of("Paper", "Food scraps", "Plastic bag", "Cotton"), 2,
                                                "Plastic bags can take 10–1000 years to decompose in a landfill.", 2));
                                quiz3.setQuestions(q3Questions);

                                quizRepository.saveAll(List.of(quiz1, quiz2, quiz3));
                                System.out.println("[DataSeeder] ✅ Seeded 3 sample quizzes");
                        } else {
                                System.out.println("[DataSeeder] ⏭ Quizzes already exist — skipping");
                        }

                };
        }

        private Quest createQuest(String title, String description, String emoji,
                        Quest.QuestType type, Quest.QuestAction action,
                        int target, int points, int coins, String color) {
                Quest quest = new Quest();
                quest.setTitle(title);
                quest.setDescription(description);
                quest.setEmoji(emoji);
                quest.setType(type);
                quest.setAction(action);
                quest.setTarget(target);
                quest.setPoints(points);
                quest.setCoins(coins);
                quest.setColor(color);
                quest.setActive(true);
                return quest;
        }

        /**
         * Creates a Question entity linked to its parent Quiz.
         * ID is auto-generated by JPA (no longer set manually).
         */
        private Question makeQuestion(Quiz quiz, String text, List<String> options,
                        int correct, String explanation, int order) {
                Question q = new Question();
                q.setQuiz(quiz); // IMPORTANT: set bidirectional parent reference
                q.setText(text);
                q.setOptions(options);
                q.setCorrectAnswer(correct);
                q.setExplanation(explanation);
                q.setQuestionOrder(order);
                return q;
        }
}