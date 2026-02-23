# EcoAlly 🌍

EcoAlly is an interactive, gamified educational platform aimed at raising environmental awareness among students. By transforming ecological learning into an engaging journey, the application encourages students to learn about and take action on environmental issues, while providing teachers with comprehensive tools to track their students' progress.

## 🌟 What the Project Does

EcoAlly bridges the gap between environmental education and actionable real-world habits through a dual-role system (Students and Teachers):

1. **Gamified Learning Experience (Students)**
   - **Quizzes & Challenges:** Students participate in educational quizzes and daily environmental challenges to earn points.
   - **Quest System:** Structured, phase-based quests that guide students through various ecological topics.
   - **Real-World Proof:** Integration with image uploads (via Cloudinary) allows students to submit photographic proof of their real-world environmental actions.
   - **Rewards & Progression:** Points earned can be spent in the **Virtual Store** to unlock custom avatars, profile badges, and special items.
   - **Leaderboards:** Fosters healthy, engaging competition among peers.

2. **Monitoring & Analytics (Teachers)**
   - **Teacher Dashboard:** Educators get a high-level overview of class performance.
   - **Progress Tracking:** Teachers can monitor individual student progress, module completion rates, and overall engagement with the platform's eco-challenges.

## 🚀 The Impact

EcoAlly seeks to instill lifelong sustainable habits and promote environmental stewardship in the younger generation. By combining structured education with gamification and tangible real-world challenges, it transforms passive learning into active environmental participation, cultivating a more eco-conscious society for the future.

## 💻 Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Radix UI Primitives 
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **State Management & Forms:** React Hook Form

### Backend
- **Framework:** Java Spring Boot (3.5.x)
- **Database:** MongoDB (Spring Data MongoDB)
- **Authentication:** Spring Security with JWT (JSON Web Tokens)
- **Media Management:** Cloudinary (for challenge/quest photo uploads)
- **Utilities:** Lombok, Maven

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Java Development Kit (JDK) 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/)
- Running MongoDB instance
- Cloudinary Account (for media uploads)

### Running the Backend
1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Configure your environment properties in `src/main/resources/application.properties` (e.g., MongoDB URI, application port, JWT secret, Cloudinary credentials).
3. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The backend typically runs on `http://localhost:8080`)*

### Running the Frontend
1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Set your environment variables in `.env` (like the API Base URL for the backend).
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The frontend typically runs on `http://localhost:5173`)*

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
