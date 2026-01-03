import { 
  users, 
  gameProgress, 
  achievements, 
  gameScores,
  type User, 
  type InsertUser,
  type GameProgress,
  type InsertGameProgress,
  type Achievement,
  type InsertAchievement,
  type GameScore,
  type InsertGameScore
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStars(userId: number, stars: number): Promise<User>;
  
  // Game progress operations
  getGameProgress(userId: number): Promise<GameProgress[]>;
  getGameProgressByGame(userId: number, gameId: string): Promise<GameProgress | undefined>;
  createOrUpdateGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  
  // Achievement operations
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  
  // Game score operations
  getGameScores(userId: number, gameType?: string): Promise<GameScore[]>;
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  getBestScore(userId: number, gameType: string): Promise<GameScore | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStars(userId: number, stars: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const [updatedUser] = await db
      .update(users)
      .set({ totalStars: user.totalStars + stars })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  async getGameProgress(userId: number): Promise<GameProgress[]> {
    return await db.select().from(gameProgress).where(eq(gameProgress.userId, userId));
  }

  async getGameProgressByGame(userId: number, gameId: string): Promise<GameProgress | undefined> {
    const [progress] = await db
      .select()
      .from(gameProgress)
      .where(and(eq(gameProgress.userId, userId), eq(gameProgress.gameId, gameId)));
    return progress || undefined;
  }

  async createOrUpdateGameProgress(insertProgress: InsertGameProgress): Promise<GameProgress> {
    const existing = await this.getGameProgressByGame(insertProgress.userId, insertProgress.gameId);
    
    if (existing) {
      const [updated] = await db
        .update(gameProgress)
        .set({
          ...insertProgress,
          lastPlayedAt: new Date(),
        })
        .where(eq(gameProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [progress] = await db
        .insert(gameProgress)
        .values({
          ...insertProgress,
          lastPlayedAt: new Date(),
        })
        .returning();
      return progress;
    }
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values({
        ...insertAchievement,
        unlockedAt: new Date(),
      })
      .returning();
    return achievement;
  }

  async getGameScores(userId: number, gameType?: string): Promise<GameScore[]> {
    if (gameType) {
      return await db
        .select()
        .from(gameScores)
        .where(and(eq(gameScores.userId, userId), eq(gameScores.gameType, gameType)));
    }
    
    return await db.select().from(gameScores).where(eq(gameScores.userId, userId));
  }

  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const [score] = await db
      .insert(gameScores)
      .values({
        ...insertScore,
        playedAt: new Date(),
      })
      .returning();
    return score;
  }

  async getBestScore(userId: number, gameType: string): Promise<GameScore | undefined> {
    const scores = await this.getGameScores(userId, gameType);
    return scores.reduce((best, current) => {
      if (!best || current.score > best.score) return current;
      return best;
    }, undefined as GameScore | undefined);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameProgress: Map<string, GameProgress>;
  private achievements: Map<string, Achievement>;
  private gameScores: Map<number, GameScore>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentAchievementId: number;
  private currentScoreId: number;

  constructor() {
    this.users = new Map();
    this.gameProgress = new Map();
    this.achievements = new Map();
    this.gameScores = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentAchievementId = 1;
    this.currentScoreId = 1;
    
    // Create default user
    this.createDefaultUser();
  }

  private async createDefaultUser() {
    const defaultUser: User = {
      id: 1,
      username: "little_muslim",
      age: 8,
      totalStars: 245,
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;
    
    // Create sample progress data
    const sampleProgress = [
      { userId: 1, gameId: "greetings", levelsCompleted: 6, totalLevels: 10, stars: 3, maxStars: 5 },
      { userId: 1, gameId: "table-manners", levelsCompleted: 3, totalLevels: 10, stars: 2, maxStars: 5 },
      { userId: 1, gameId: "respect-kindness", levelsCompleted: 8, totalLevels: 10, stars: 4, maxStars: 5 },
      { userId: 1, gameId: "mosque-etiquette", levelsCompleted: 1, totalLevels: 10, stars: 1, maxStars: 5 },
      { userId: 1, gameId: "family-respect", levelsCompleted: 5, totalLevels: 10, stars: 3, maxStars: 5 },
      { userId: 1, gameId: "daily-duas", levelsCompleted: 4, totalLevels: 10, stars: 2, maxStars: 5 },
    ];
    
    for (const progress of sampleProgress) {
      await this.createOrUpdateGameProgress(progress);
    }
    
    // Create sample achievements
    const sampleAchievements = [
      { userId: 1, achievementId: "greeting_master", title: "Greeting Master", description: "Completed all greeting lessons!", stars: 3 },
      { userId: 1, achievementId: "kind_helper", title: "Kind Helper", description: "Showed kindness 50 times!", stars: 2 },
      { userId: 1, achievementId: "daily_learner", title: "Daily Learner", description: "Played for 7 days in a row!", stars: 1 },
    ];
    
    for (const achievement of sampleAchievements) {
      await this.createAchievement(achievement);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      totalStars: 0,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStars(userId: number, stars: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, totalStars: user.totalStars + stars };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getGameProgress(userId: number): Promise<GameProgress[]> {
    return Array.from(this.gameProgress.values()).filter(
      progress => progress.userId === userId
    );
  }

  async getGameProgressByGame(userId: number, gameId: string): Promise<GameProgress | undefined> {
    return Array.from(this.gameProgress.values()).find(
      progress => progress.userId === userId && progress.gameId === gameId
    );
  }

  async createOrUpdateGameProgress(insertProgress: InsertGameProgress): Promise<GameProgress> {
    const existing = await this.getGameProgressByGame(insertProgress.userId, insertProgress.gameId);
    
    if (existing) {
      const updated: GameProgress = {
        ...existing,
        ...insertProgress,
        lastPlayedAt: new Date(),
      };
      this.gameProgress.set(`${existing.userId}-${existing.gameId}`, updated);
      return updated;
    } else {
      const id = this.currentProgressId++;
      const progress: GameProgress = {
        userId: insertProgress.userId,
        gameId: insertProgress.gameId,
        levelsCompleted: insertProgress.levelsCompleted ?? 0,
        totalLevels: insertProgress.totalLevels ?? 10,
        stars: insertProgress.stars ?? 0,
        maxStars: insertProgress.maxStars ?? 5,
        id,
        lastPlayedAt: new Date(),
      };
      this.gameProgress.set(`${progress.userId}-${progress.gameId}`, progress);
      return progress;
    }
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      achievement => achievement.userId === userId
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = {
      userId: insertAchievement.userId,
      achievementId: insertAchievement.achievementId,
      title: insertAchievement.title,
      description: insertAchievement.description,
      stars: insertAchievement.stars ?? 0,
      id,
      unlockedAt: new Date(),
    };
    this.achievements.set(`${achievement.userId}-${achievement.achievementId}`, achievement);
    return achievement;
  }

  async getGameScores(userId: number, gameType?: string): Promise<GameScore[]> {
    const scores = Array.from(this.gameScores.values()).filter(
      score => score.userId === userId
    );
    
    if (gameType) {
      return scores.filter(score => score.gameType === gameType);
    }
    
    return scores;
  }

  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = this.currentScoreId++;
    const score: GameScore = {
      ...insertScore,
      id,
      playedAt: new Date(),
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getBestScore(userId: number, gameType: string): Promise<GameScore | undefined> {
    const scores = await this.getGameScores(userId, gameType);
    return scores.reduce((best, current) => {
      if (!best || current.score > best.score) return current;
      return best;
    }, undefined as GameScore | undefined);
  }
}

export const storage = new MemStorage();
