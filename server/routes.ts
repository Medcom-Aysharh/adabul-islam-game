import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameProgressSchema, insertGameScoreSchema, insertAchievementSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (default user for now)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default user ID
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get user's game progress
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getGameProgress(1); // Default user ID
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  // Update game progress
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertGameProgressSchema.parse(req.body);
      const progress = await storage.createOrUpdateGameProgress(progressData);
      
      // Award stars to user
      if (progressData.stars && progressData.stars > 0) {
        await storage.updateUserStars(progressData.userId, progressData.stars);
      }
      
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1); // Default user ID
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Create new achievement
  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(achievementData);
      
      // Award stars to user
      if (achievementData.stars && achievementData.stars > 0) {
        await storage.updateUserStars(achievementData.userId, achievementData.stars);
      }
      
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ message: "Invalid achievement data" });
    }
  });

  // Get game scores
  app.get("/api/scores", async (req, res) => {
    try {
      const gameType = req.query.gameType as string;
      const scores = await storage.getGameScores(1, gameType); // Default user ID
      res.json(scores);
    } catch (error) {
      res.status(500).json({ message: "Failed to get scores" });
    }
  });

  // Create game score
  app.post("/api/scores", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.createGameScore(scoreData);
      
      // Award stars based on performance
      const starRatio = score.score / score.maxScore;
      let stars = 0;
      if (starRatio >= 0.9) stars = 3;
      else if (starRatio >= 0.7) stars = 2;
      else if (starRatio >= 0.5) stars = 1;
      
      if (stars > 0) {
        await storage.updateUserStars(scoreData.userId, stars);
      }
      
      res.json({ ...score, starsEarned: stars });
    } catch (error) {
      res.status(400).json({ message: "Invalid score data" });
    }
  });

  // Get best score for a game type
  app.get("/api/scores/best/:gameType", async (req, res) => {
    try {
      const { gameType } = req.params;
      const bestScore = await storage.getBestScore(1, gameType); // Default user ID
      res.json(bestScore || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to get best score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
