package com.backend.ecoally.config;

import com.backend.ecoally.model.Quest;
import com.backend.ecoally.repository.QuestRepository;
import com.backend.ecoally.repository.QuizRepository;
import com.backend.ecoally.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final QuestRepository questRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {

            // ── Quests ──────────────────────────────────────────────────────
            if (questRepository.count() == 0) {
                List<Quest> quests = List.of(
                        createQuest("Daily Quiz Champion", "Complete 1 quiz today",
                                "🧠", Quest.QuestType.DAILY, Quest.QuestAction.COMPLETE_QUIZ,
                                1, 50, 10, "bg-blue-100 border-blue-300"),
                        createQuest("Photo Challenger", "Submit 1 eco photo challenge",
                                "📸", Quest.QuestType.DAILY, Quest.QuestAction.COMPLETE_CHALLENGE,
                                1, 75, 15, "bg-green-100 border-green-300"),
                        createQuest("Weekly Scholar", "Complete 5 quizzes this week",
                                "🎓", Quest.QuestType.WEEKLY, Quest.QuestAction.COMPLETE_QUIZ,
                                5, 200, 40, "bg-purple-100 border-purple-300"),
                        createQuest("Eco Warrior", "Submit 3 challenges this week",
                                "🌱", Quest.QuestType.WEEKLY, Quest.QuestAction.COMPLETE_CHALLENGE,
                                3, 300, 60, "bg-emerald-100 border-emerald-300"),
                        createQuest("Streak Keeper", "Maintain a 7-day streak",
                                "🔥", Quest.QuestType.WEEKLY, Quest.QuestAction.MAINTAIN_STREAK,
                                7, 250, 50, "bg-orange-100 border-orange-300"),
                        createQuest("Perfect Score", "Score 100% on any quiz",
                                "💎", Quest.QuestType.EPIC, Quest.QuestAction.COMPLETE_QUIZ,
                                1, 500, 100, "bg-yellow-100 border-yellow-300")
                );
                questRepository.saveAll(quests);
                System.out.println("[DataSeeder] ✅ Seeded " + quests.size() + " quests");
            } else {
                System.out.println("[DataSeeder] ⏭ Quests already exist — skipping");
            }

            // ── Quizzes ─────────────────────────────────────────────────────
            if (quizRepository.count() == 0) {
                com.backend.ecoally.model.Quiz quiz1 = new com.backend.ecoally.model.Quiz();
                quiz1.setTitle("Introduction to Climate Change");
                quiz1.setDescription("Test your basic knowledge about climate change");
                quiz1.setTopic("climate-change");
                quiz1.setDifficulty(com.backend.ecoally.model.Quiz.Difficulty.EASY);
                quiz1.setTimeLimit(300);
                quiz1.setPublished(true);
                quiz1.setCreatedBy("system");
                quiz1.setQuestions(List.of(
                        makeQuestion("What gas is most responsible for the greenhouse effect?",
                                List.of("Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"), 1,
                                "CO₂ traps heat in the atmosphere, causing global warming."),
                        makeQuestion("What does 'carbon footprint' mean?",
                                List.of("The size of your shoe", "Total greenhouse gas emissions you cause",
                                        "Carbon tax amount", "Size of a carbon atom"), 1,
                                "Your carbon footprint is the total amount of greenhouse gases you produce."),
                        makeQuestion("Which renewable energy source uses sunlight?",
                                List.of("Wind power", "Geothermal", "Solar power", "Hydropower"), 2,
                                "Solar panels convert sunlight directly into electricity.")
                ));

                com.backend.ecoally.model.Quiz quiz2 = new com.backend.ecoally.model.Quiz();
                quiz2.setTitle("Biodiversity & Ecosystems");
                quiz2.setDescription("Learn about the importance of biodiversity");
                quiz2.setTopic("biodiversity");
                quiz2.setDifficulty(com.backend.ecoally.model.Quiz.Difficulty.MEDIUM);
                quiz2.setTimeLimit(600);
                quiz2.setPublished(true);
                quiz2.setCreatedBy("system");
                quiz2.setQuestions(List.of(
                        makeQuestion("What is biodiversity?",
                                List.of("Variety of life on Earth", "A type of plant",
                                        "A chemical process", "Ocean depth measurement"), 0,
                                "Biodiversity refers to the variety of all living species on Earth."),
                        makeQuestion("Which of these is a major threat to biodiversity?",
                                List.of("Reforestation", "Habitat destruction",
                                        "Wildlife sanctuaries", "Organic farming"), 1,
                                "Habitat destruction is the leading cause of biodiversity loss worldwide."),
                        makeQuestion("What is a food chain?",
                                List.of("A restaurant chain", "Energy transfer between organisms",
                                        "A type of ecosystem", "A farming method"), 1,
                                "A food chain shows how energy is transferred from one organism to another.")
                ));

                com.backend.ecoally.model.Quiz quiz3 = new com.backend.ecoally.model.Quiz();
                quiz3.setTitle("Waste Management & Recycling");
                quiz3.setDescription("Test your knowledge about proper waste management");
                quiz3.setTopic("waste-management");
                quiz3.setDifficulty(com.backend.ecoally.model.Quiz.Difficulty.EASY);
                quiz3.setTimeLimit(300);
                quiz3.setPublished(true);
                quiz3.setCreatedBy("system");
                quiz3.setQuestions(List.of(
                        makeQuestion("Which bin should glass bottles go in?",
                                List.of("General waste", "Recycling bin", "Compost bin", "Hazardous waste"), 1,
                                "Glass is fully recyclable and should always go in the recycling bin."),
                        makeQuestion("What does the 3R principle stand for?",
                                List.of("Read, Run, Rest", "Reduce, Reuse, Recycle",
                                        "Repair, Restore, Renew", "Remove, Replace, Reclaim"), 1,
                                "The 3Rs — Reduce, Reuse, Recycle — are the foundation of waste management."),
                        makeQuestion("Which material takes the longest to decompose in a landfill?",
                                List.of("Paper", "Food scraps", "Plastic bag", "Cotton"), 2,
                                "Plastic bags can take 10–1000 years to decompose in a landfill.")
                ));

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

    private com.backend.ecoally.model.Quiz.Question makeQuestion(
            String text, List<String> options, int correct, String explanation) {
        com.backend.ecoally.model.Quiz.Question q = new com.backend.ecoally.model.Quiz.Question();
        q.setId(java.util.UUID.randomUUID().toString());
        q.setText(text);
        q.setOptions(options);
        q.setCorrectAnswer(correct);
        q.setExplanation(explanation);
        q.setOrder(0);
        return q;
    }
}