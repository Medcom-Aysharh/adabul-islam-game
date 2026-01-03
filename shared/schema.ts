import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  age: integer("age").notNull(),
  totalStars: integer("total_stars").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gameProgress = pgTable("game_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameId: text("game_id").notNull(),
  levelsCompleted: integer("levels_completed").notNull().default(0),
  totalLevels: integer("total_levels").notNull().default(10),
  stars: integer("stars").notNull().default(0),
  maxStars: integer("max_stars").notNull().default(5),
  lastPlayedAt: timestamp("last_played_at").notNull().defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stars: integer("stars").notNull().default(0),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  gameType: text("game_type").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  timeSpent: integer("time_spent").notNull(), // in seconds
  playedAt: timestamp("played_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalStars: true,
  createdAt: true,
});

export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true,
  lastPlayedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).omit({
  id: true,
  playedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;
export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
