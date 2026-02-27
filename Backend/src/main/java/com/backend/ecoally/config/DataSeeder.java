package com.backend.ecoally.config;

import com.backend.ecoally.model.Challenge;
import com.backend.ecoally.model.Quest;
import com.backend.ecoally.model.Question;
import com.backend.ecoally.model.Quiz;
import com.backend.ecoally.repository.ChallengeRepository;
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
        private final ChallengeRepository challengeRepository;

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

                        // ── Challenges ──────────────────────────────────────────────────────
                        if (challengeRepository.count() == 0) {
                                List<Challenge> challenges = new ArrayList<>();

                                // ── PHOTO challenges (trigger EcoLens + appear on EcoMap) ──────
                                challenges.add(makeChallenge(
                                                "Plant a Native Tree",
                                                "Find and photograph a native tree in your area. EcoLens AI will identify the species and verify it's native to your region.",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.EASY,
                                                100,
                                                "45 Minutes",
                                                "🌳",
                                                "bg-green-100",
                                                List.of(
                                                                "Photograph the full tree clearly",
                                                                "Include leaves or flowers for better species identification",
                                                                "Take the photo outdoors in natural lighting",
                                                                "Enable location access for native species bonus"),
                                                List.of(
                                                                "Neem, Banyan, Peepal, and Tulsi are common Indian native species",
                                                                "Good lighting improves AI accuracy",
                                                                "Avoid blurry or cropped photos",
                                                                "Native species earn up to 50% bonus points"),
                                                "biodiversity"));

                                challenges.add(makeChallenge(
                                                "Eco Garden Spotter",
                                                "Photograph plants, flowers, or a garden patch. AI will classify the plant category and score your eco-action.",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.EASY,
                                                80,
                                                "30 Minutes",
                                                "🌿",
                                                "bg-emerald-100",
                                                List.of(
                                                                "Take a clear close-up photo of the plant",
                                                                "Show the full plant or a distinct feature like leaf or flower",
                                                                "Capture in daylight for best results",
                                                                "Enable GPS for location-based native bonus"),
                                                List.of(
                                                                "Tulsi (Holy Basil) is easy to find and scores high",
                                                                "Hibiscus and Marigold are commonly identified",
                                                                "Higher confidence = higher EcoScore",
                                                                "Enable GPS — native species get bonus points"),
                                                "biodiversity"));

                                challenges.add(makeChallenge(
                                                "Water Body Guardian",
                                                "Find a natural water body — river, pond, lake, or stream — and photograph it. Help map India's water resources.",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.MEDIUM,
                                                120,
                                                "1 Hour",
                                                "💧",
                                                "bg-blue-100",
                                                List.of(
                                                                "Photograph a natural water body (not a tank or tap)",
                                                                "Show the surrounding environment clearly",
                                                                "Take photo during daylight",
                                                                "Enable location — water body location will be pinned on EcoMap"),
                                                List.of(
                                                                "Rivers, ponds, and lakes all qualify",
                                                                "Wider view scores better than a close-up",
                                                                "Your pin will show on the community EcoMap",
                                                                "Include shoreline vegetation for a higher eco score"),
                                                "water-conservation"));

                                challenges.add(makeChallenge(
                                                "Wildlife Spotter",
                                                "Photograph local wildlife — birds, insects, reptiles, or mammals. Citizen science in action!",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.HARD,
                                                150,
                                                "1-2 Hours",
                                                "🦋",
                                                "bg-purple-100",
                                                List.of(
                                                                "Photograph a wild animal, bird, or insect in its natural habitat",
                                                                "Do not disturb or approach dangerous animals",
                                                                "Take multiple photos from a safe distance",
                                                                "Enable location to map biodiversity in your area"),
                                                List.of(
                                                                "Common birds like sparrows and pigeons count",
                                                                "Butterflies and bees are excellent subjects",
                                                                "Early morning is the best time for wildlife",
                                                                "Your photo will be verified by AI and teacher"),
                                                "biodiversity"));

                                challenges.add(makeChallenge(
                                                "Urban Green Finder",
                                                "Find patches of green — parks, roadside trees, terrace gardens — in your city. Urban greenery matters!",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.EASY,
                                                90,
                                                "45 Minutes",
                                                "🌳",
                                                "bg-lime-100",
                                                List.of(
                                                                "Photograph a green space in an urban area",
                                                                "Include trees, shrubs, or grass patches",
                                                                "Location pin will mark your urban green discovery",
                                                                "Enable GPS for map contribution"),
                                                List.of(
                                                                "Parks and gardens qualify",
                                                                "Even roadside trees are valid",
                                                                "Terrace gardens count as urban green",
                                                                "More green in the frame = higher score"),
                                                "urban-greening"));

                                challenges.add(makeChallenge(
                                                "Recycling Spotter",
                                                "Find and photograph waste being properly recycled or composted. Document the circular economy in action.",
                                                Challenge.ChallengeType.PHOTO,
                                                Challenge.Difficulty.MEDIUM,
                                                110,
                                                "30 Minutes",
                                                "♻️",
                                                "bg-orange-100",
                                                List.of(
                                                                "Photograph a recycling bin, compost pile, or waste-processing activity",
                                                                "Show the waste clearly in the image",
                                                                "Enable location to map recycling infrastructure",
                                                                "Add a note about what is being recycled"),
                                                List.of(
                                                                "Municipal recycling bins are valid",
                                                                "Compost bins or pits score well",
                                                                "Plastic segregation photos qualify",
                                                                "Your pin helps map recycling access"),
                                                "waste-management"));

                                // ── ACTION challenges (no EcoLens, no EcoMap pin) ──────────────
                                challenges.add(makeChallenge(
                                                "30-Day No Plastic Challenge",
                                                "Commit to avoiding single-use plastic for 30 days and document your journey.",
                                                Challenge.ChallengeType.ACTION,
                                                Challenge.Difficulty.HARD,
                                                200,
                                                "30 Days",
                                                "🚫",
                                                "bg-red-100",
                                                List.of(
                                                                "Avoid all single-use plastic items for 30 days",
                                                                "Use alternatives like cloth bags, glass bottles, metal straws",
                                                                "Keep a daily journal of your eco-swaps",
                                                                "Share your progress with peers"),
                                                List.of(
                                                                "Start with the easy swaps: bags and bottles",
                                                                "Buy in bulk to reduce packaging",
                                                                "Bamboo toothbrushes are a great first swap",
                                                                "Refillable water bottles save 100+ plastic bottles per year"),
                                                "plastic-reduction"));

                                challenges.add(makeChallenge(
                                                "Home Energy Audit",
                                                "Conduct a simple energy audit of your home and identify 3 ways to reduce electricity usage.",
                                                Challenge.ChallengeType.ACTION,
                                                Challenge.Difficulty.MEDIUM,
                                                130,
                                                "2 Hours",
                                                "⚡",
                                                "bg-yellow-100",
                                                List.of(
                                                                "Check all appliances and note their energy ratings",
                                                                "Identify 3 specific ways to reduce energy consumption",
                                                                "Calculate estimated monthly savings",
                                                                "Implement at least 1 change immediately"),
                                                List.of(
                                                                "LED bulbs use 80% less energy than incandescent",
                                                                "Unplugging chargers when not in use saves energy",
                                                                "Natural light during day reduces electricity use",
                                                                "A 5-star AC uses 30% less energy than 1-star"),
                                                "energy-conservation"));

                                // ── SOCIAL challenges ──────────────────────────────────────────
                                challenges.add(makeChallenge(
                                                "Community Clean-Up Drive",
                                                "Organise or participate in a clean-up drive in your neighbourhood, school, or local park.",
                                                Challenge.ChallengeType.SOCIAL,
                                                Challenge.Difficulty.MEDIUM,
                                                160,
                                                "Half Day",
                                                "🤝",
                                                "bg-pink-100",
                                                List.of(
                                                                "Gather at least 3 participants (including yourself)",
                                                                "Collect and sort waste by type (plastic, paper, organic)",
                                                                "Document the before and after with photos",
                                                                "Dispose of waste responsibly"),
                                                List.of(
                                                                "Coordinate with local municipality for bin access",
                                                                "Gloves and bags are essential — be prepared",
                                                                "Schools and parks are great starting points",
                                                                "Share results on social media to inspire others"),
                                                "community-action"));

                                // ── LEARNING challenges ────────────────────────────────────────
                                challenges.add(makeChallenge(
                                                "Eco Research Report",
                                                "Research and write a short report (min 300 words) on a local environmental issue affecting your city or state.",
                                                Challenge.ChallengeType.LEARNING,
                                                Challenge.Difficulty.MEDIUM,
                                                120,
                                                "3 Hours",
                                                "📖",
                                                "bg-indigo-100",
                                                List.of(
                                                                "Choose a real local environmental issue (air quality, water pollution, deforestation, etc.)",
                                                                "Write a minimum 300-word report with facts and sources",
                                                                "Propose at least 2 actionable solutions",
                                                                "Submit the written report as your notes"),
                                                List.of(
                                                                "India has 14 of the world's 20 most polluted cities",
                                                                "Use government reports from CPCB, MoEFCC for data",
                                                                "Local newspapers are great sources for recent issues",
                                                                "Ganges river pollution, Delhi smog, Western Ghats deforestation are strong topics"),
                                                "environmental-education"));

                                challengeRepository.saveAll(challenges);
                                System.out.println("[DataSeeder] ✅ Seeded " + challenges.size() + " challenges");
                        } else {
                                System.out.println("[DataSeeder] ⏭ Challenges already exist — skipping");
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

        private Challenge makeChallenge(
                        String title,
                        String description,
                        Challenge.ChallengeType type,
                        Challenge.Difficulty difficulty,
                        int points,
                        String duration,
                        String icon,
                        String color,
                        List<String> requirements,
                        List<String> tips,
                        String learningTopic) {
                Challenge c = new Challenge();
                c.setTitle(title);
                c.setDescription(description);
                c.setType(type);
                c.setDifficulty(difficulty);
                c.setPoints(points);
                c.setDuration(duration);
                c.setIcon(icon);
                c.setColor(color);
                c.setRequirements(requirements);
                c.setTips(tips);
                c.setLearningTopic(learningTopic);
                c.setPublished(true);
                c.setCreatedBy(null);
                return c;
        }
}