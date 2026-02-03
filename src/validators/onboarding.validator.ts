import { z } from "zod";

export const userOnboardingSchema = z.object({
  primaryGoal: z
    .string()
    .min(2, "Primary goal must be at least 2 characters")
    .max(100, "Primary goal must not exceed 100 characters"),

  fitnessLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "Fitness level must be beginner, intermediate, or advanced",
  }),

  gender: z.enum(["male", "female"], {
    message: "Gender must be male or female",
  }),

  age: z.coerce
    .number()
    .int("Age must be an integer")
    .min(10, "Age must be at least 10")
    .max(100, "Age must not exceed 100"),

  height: z.coerce
    .number()
    .min(50, "Height must be at least 50 cm")
    .max(300, "Height must not exceed 300 cm"),

  weight: z.coerce
    .number()
    .min(20, "Weight must be at least 20 kg")
    .max(500, "Weight must not exceed 500 kg"),

  dietaryPreferences: z
    .string()
    .min(2, "Dietary preference must be at least 2 characters")
    .max(100, "Dietary preference must not exceed 100 characters"),

  equipments: z
    .array(z.string().min(2, "Equipment name must be at least 2 characters"))
    .min(1, "At least one equipment must be provided"),
});

export const trainerOnboardingSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),

  experience: z.string().regex(/^\d+$/, "Experience must be a number of years"),

  specializations: z
    .array(z.string().min(2, "Specialization too short"))
    .min(1, "At least one specialization is required"),
});

export type UserOnboardingDTO = z.infer<typeof userOnboardingSchema>;
export type TrainerOnboardingDTO = z.infer<typeof trainerOnboardingSchema>;
