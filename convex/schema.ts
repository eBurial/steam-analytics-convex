import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    appId: v.number(),
    name: v.string(),
    currentPlayers: v.number(),
    peakPlayers24h: v.number(),
    allTimePeak: v.optional(v.number()),
    price: v.optional(v.string()),
    originalPrice: v.optional(v.string()),
    discountPercent: v.optional(v.number()),
    releaseDate: v.optional(v.string()),
    reviewScore: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    headerImage: v.optional(v.string()),
    latestNews: v.optional(v.string()),
    newsDate: v.optional(v.number()),
    // Additional metadata
    developers: v.optional(v.array(v.string())),
    publishers: v.optional(v.array(v.string())),
    genres: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    shortDescription: v.optional(v.string()),
    screenshots: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    supportedLanguages: v.optional(v.array(v.string())),
    metacriticScore: v.optional(v.number()),
    lastUpdated: v.number(),
  }).index("by_appId", ["appId"])
    .index("by_players", ["currentPlayers"]),
  
  playerHistory: defineTable({
    appId: v.number(),
    playerCount: v.number(),
    timestamp: v.number(),
  }).index("by_appId_timestamp", ["appId", "timestamp"])
    .index("by_timestamp", ["timestamp"]),
});
