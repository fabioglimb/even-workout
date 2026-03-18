import type { Workout } from "../types/workout";

export const presetWorkouts: Workout[] = [
  {
    id: "full-body-blitz",
    title: "Full Body Blitz",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    target: "Full Body",
    exercises: [
      { name: "Barbell Squat", sets: 4, reps: 10, durationSeconds: null, restSeconds: 60 },
      { name: "Push-Ups", sets: 3, reps: 15, durationSeconds: null, restSeconds: 45 },
      { name: "Bent-Over Row", sets: 4, reps: 10, durationSeconds: null, restSeconds: 60 },
      { name: "Overhead Press", sets: 3, reps: 12, durationSeconds: null, restSeconds: 45 },
      { name: "Plank", sets: 3, reps: null, durationSeconds: 45, restSeconds: 30 },
    ],
  },
  {
    id: "upper-body-power",
    title: "Upper Body Power",
    difficulty: "advanced",
    estimatedMinutes: 50,
    target: "Chest, Back, Shoulders",
    exercises: [
      { name: "Bench Press", sets: 5, reps: 5, durationSeconds: null, restSeconds: 90 },
      { name: "Weighted Pull-Ups", sets: 4, reps: 6, durationSeconds: null, restSeconds: 90 },
      { name: "Dumbbell Shoulder Press", sets: 4, reps: 8, durationSeconds: null, restSeconds: 60 },
      { name: "Barbell Curl", sets: 3, reps: 10, durationSeconds: null, restSeconds: 45 },
      { name: "Tricep Dips", sets: 3, reps: 12, durationSeconds: null, restSeconds: 45 },
      { name: "Face Pulls", sets: 3, reps: 15, durationSeconds: null, restSeconds: 30 },
    ],
  },
  {
    id: "leg-day",
    title: "Leg Day",
    difficulty: "advanced",
    estimatedMinutes: 55,
    target: "Quads, Hamstrings, Glutes",
    exercises: [
      { name: "Back Squat", sets: 5, reps: 5, durationSeconds: null, restSeconds: 120 },
      { name: "Romanian Deadlift", sets: 4, reps: 8, durationSeconds: null, restSeconds: 90 },
      { name: "Leg Press", sets: 4, reps: 12, durationSeconds: null, restSeconds: 60 },
      { name: "Walking Lunges", sets: 3, reps: 12, durationSeconds: null, restSeconds: 60 },
      { name: "Calf Raises", sets: 4, reps: 15, durationSeconds: null, restSeconds: 30 },
    ],
  },
  {
    id: "core-crusher",
    title: "Core Crusher",
    difficulty: "beginner",
    estimatedMinutes: 25,
    target: "Abs, Obliques, Lower Back",
    exercises: [
      { name: "Crunches", sets: 3, reps: 20, durationSeconds: null, restSeconds: 30 },
      { name: "Plank", sets: 3, reps: null, durationSeconds: 45, restSeconds: 30 },
      { name: "Russian Twists", sets: 3, reps: 20, durationSeconds: null, restSeconds: 30 },
      { name: "Leg Raises", sets: 3, reps: 15, durationSeconds: null, restSeconds: 30 },
      { name: "Superman Hold", sets: 3, reps: null, durationSeconds: 30, restSeconds: 30 },
    ],
  },
  {
    id: "hiit-sprint",
    title: "HIIT Sprint",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    target: "Cardio, Full Body",
    exercises: [
      { name: "Burpees", sets: 4, reps: 10, durationSeconds: null, restSeconds: 45 },
      { name: "Mountain Climbers", sets: 4, reps: null, durationSeconds: 30, restSeconds: 30 },
      { name: "Jump Squats", sets: 4, reps: 15, durationSeconds: null, restSeconds: 45 },
      { name: "High Knees", sets: 4, reps: null, durationSeconds: 30, restSeconds: 30 },
      { name: "Box Jumps", sets: 3, reps: 10, durationSeconds: null, restSeconds: 60 },
    ],
  },
];

/** @deprecated Use presetWorkouts or context's allWorkouts instead */
export const workouts = presetWorkouts;

export function getWorkoutById(id: string, allWorkouts?: Workout[]): Workout | undefined {
  if (allWorkouts) return allWorkouts.find((w) => w.id === id);
  return presetWorkouts.find((w) => w.id === id);
}

export function getTotalSets(workout: Workout): number {
  return workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
}
