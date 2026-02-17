# FitLife - Your Fitness Journey

FitLife is a comprehensive web application designed to help you track your nutrition, workouts, and overall progress. This guide explains the key features and how the API powers them.

## Features & API Role

### 1. Dashboard

**What it does:**
The Dashboard is your central hub. It provides an at-a-glance view of your daily activity, including calories consumed vs. burned, recent workouts, and quick stats.

**Role of the API:**

- **Authentication:** The API handles user login and session management (`/api/v1/users/login`, `/api/v1/users/profile`).
- **Data Aggregation:** It fetches daily summaries from both Nutrition and Workout logs to display your current status.

### 2. Nutrition

**What it does:**
Track what you eat to stay on top of your diet. You can search for foods, log meals, and see your daily macronutrient breakdown (Calories, Protein, Fat, Carbs).

**Role of the API:**

- **Search:** The API connects to the Edamam Database to provide extensive food data (`/api/v1/nutrition/search`).
- **Logging:** It saves your meals to the database, ensuring your history is preserved (`/api/v1/nutrition/log`).
- **Analysis:** It calculates daily totals and averages to help you visualize your intake trends (`/api/v1/nutrition/summary`).

### 3. Workout

**What it does:**
Log your exercises to monitor your training volume and intensity. You can search for exercises by muscle group or difficulty.

**Role of the API:**

- **Exercise Database:** The API searches thousands of exercises via API Ninjas to help you find the right movements (`/api/v1/workouts/search`).
- **Activity Tracking:** It stores details like sets, reps, weight, and duration (`/api/v1/workouts/log`).
- **Performance Metrics:** It aggregates your workout history to show total volume and calories burned (`/api/v1/workouts/summary`).

### 4. Progress

**What it does:**
Visualize your transformation over time. Track body weight, BMI, body fat percentage, and body measurements.

**Role of the API:**

- **Data Recording:** The API securely stores your physical measurements (`/api/v1/progress`).
- **Calculation:** It automatically calculates metrics like BMI based on your height and weight.
- **Visualization:** It provides historical data points that the frontend renders into interactive charts and graphs (`/api/v1/progress/summary`).

## Technology Stack

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB
- **External APIs:** Unsplash (Images), Edamam (Nutrition), API Ninjas (Exercises)
