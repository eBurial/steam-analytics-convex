import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const updateGame = internalMutation({
  args: {
    appId: v.number(),
    name: v.string(),
    currentPlayers: v.number(),
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
    developers: v.optional(v.array(v.string())),
    publishers: v.optional(v.array(v.string())),
    genres: v.optional(v.array(v.string())),
    categories: v.optional(v.array(v.string())),
    shortDescription: v.optional(v.string()),
    screenshots: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    supportedLanguages: v.optional(v.array(v.string())),
    metacriticScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("games")
      .withIndex("by_appId", (q) => q.eq("appId", args.appId))
      .first();

    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;

    if (existing) {
      // Calculate peak from actual 24h history
      const history = await ctx.db
        .query("playerHistory")
        .withIndex("by_appId_timestamp", (q) => 
          q.eq("appId", args.appId).gte("timestamp", last24Hours)
        )
        .collect();
      
      const peakFromHistory = history.length > 0 
        ? Math.max(...history.map(h => h.playerCount))
        : args.currentPlayers;
      
      const newPeak = Math.max(peakFromHistory, args.currentPlayers);
      
      const updateData: any = {
        currentPlayers: args.currentPlayers,
        peakPlayers24h: newPeak,
        lastUpdated: now,
      };
      
      if (args.allTimePeak !== undefined) updateData.allTimePeak = args.allTimePeak;
      if (args.price !== undefined) updateData.price = args.price;
      if (args.originalPrice !== undefined) updateData.originalPrice = args.originalPrice;
      if (args.discountPercent !== undefined) updateData.discountPercent = args.discountPercent;
      if (args.releaseDate !== undefined) updateData.releaseDate = args.releaseDate;
      if (args.reviewScore !== undefined) updateData.reviewScore = args.reviewScore;
      if (args.reviewCount !== undefined) updateData.reviewCount = args.reviewCount;
      if (args.tags !== undefined) updateData.tags = args.tags;
      if (args.headerImage !== undefined) updateData.headerImage = args.headerImage;
      if (args.latestNews !== undefined) updateData.latestNews = args.latestNews;
      if (args.newsDate !== undefined) updateData.newsDate = args.newsDate;
      if (args.developers !== undefined) updateData.developers = args.developers;
      if (args.publishers !== undefined) updateData.publishers = args.publishers;
      if (args.genres !== undefined) updateData.genres = args.genres;
      if (args.categories !== undefined) updateData.categories = args.categories;
      if (args.shortDescription !== undefined) updateData.shortDescription = args.shortDescription;
      if (args.screenshots !== undefined) updateData.screenshots = args.screenshots;
      if (args.website !== undefined) updateData.website = args.website;
      if (args.supportedLanguages !== undefined) updateData.supportedLanguages = args.supportedLanguages;
      if (args.metacriticScore !== undefined) updateData.metacriticScore = args.metacriticScore;
      
      await ctx.db.patch(existing._id, updateData);
    } else {
      await ctx.db.insert("games", {
        appId: args.appId,
        name: args.name,
        currentPlayers: args.currentPlayers,
        peakPlayers24h: args.currentPlayers,
        allTimePeak: args.allTimePeak,
        price: args.price,
        originalPrice: args.originalPrice,
        discountPercent: args.discountPercent,
        releaseDate: args.releaseDate,
        reviewScore: args.reviewScore,
        reviewCount: args.reviewCount,
        tags: args.tags,
        headerImage: args.headerImage,
        latestNews: args.latestNews,
        newsDate: args.newsDate,
        developers: args.developers,
        publishers: args.publishers,
        genres: args.genres,
        categories: args.categories,
        shortDescription: args.shortDescription,
        screenshots: args.screenshots,
        website: args.website,
        supportedLanguages: args.supportedLanguages,
        metacriticScore: args.metacriticScore,
        lastUpdated: now,
      });
    }

    await ctx.db.insert("playerHistory", {
      appId: args.appId,
      playerCount: args.currentPlayers,
      timestamp: now,
    });
  },
});

export const getTopGames = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("games")
      .withIndex("by_players")
      .order("desc")
      .take(limit);
  },
});

export const getGameHistory = query({
  args: { 
    appId: v.number(),
    hours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const hours = args.hours ?? 24;
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    
    const history = await ctx.db
      .query("playerHistory")
      .withIndex("by_appId_timestamp", (q) => 
        q.eq("appId", args.appId).gte("timestamp", cutoff)
      )
      .collect();

    return history.sort((a, b) => a.timestamp - b.timestamp);
  },
});

export const getAllGames = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  },
});
