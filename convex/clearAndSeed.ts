import { mutation } from "./_generated/server";

export const clearAndReseed = mutation({
  args: {},
  handler: async (ctx) => {
    const games = await ctx.db.query("games").collect();
    for (const game of games) {
      await ctx.db.delete(game._id);
    }
    
    const history = await ctx.db.query("playerHistory").collect();
    for (const record of history) {
      await ctx.db.delete(record._id);
    }

    const now = Date.now();
    const seedGames = [
      {
        appId: 730,
        name: "Counter-Strike 2",
        currentPlayers: 1245678,
        peakPlayers24h: 1456789,
        allTimePeak: 1818845,
        price: "Free to Play",
        releaseDate: "Sep 27, 2023",
        reviewScore: 85,
        reviewCount: 1234567,
        tags: ["FPS", "Competitive", "Tactical", "Multiplayer"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 570,
        name: "Dota 2",
        currentPlayers: 456789,
        peakPlayers24h: 567890,
        allTimePeak: 1295114,
        price: "Free to Play",
        releaseDate: "Jul 9, 2013",
        reviewScore: 82,
        reviewCount: 987654,
        tags: ["MOBA", "Strategy", "Multiplayer", "Competitive"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1938090,
        name: "Call of Duty®: Black Ops 6",
        currentPlayers: 234567,
        peakPlayers24h: 345678,
        allTimePeak: 456789,
        price: "$69.99",
        releaseDate: "Oct 25, 2024",
        reviewScore: 78,
        reviewCount: 123456,
        tags: ["FPS", "Action", "Multiplayer", "Zombies"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1938090/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1172470,
        name: "Apex Legends™",
        currentPlayers: 189456,
        peakPlayers24h: 234567,
        allTimePeak: 624473,
        price: "Free to Play",
        releaseDate: "Feb 4, 2019",
        reviewScore: 76,
        reviewCount: 567890,
        tags: ["Battle Royale", "FPS", "Free to Play", "Hero Shooter"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1623730,
        name: "Palworld",
        currentPlayers: 156789,
        peakPlayers24h: 189456,
        allTimePeak: 2101867,
        price: "$29.99",
        releaseDate: "Jan 19, 2024",
        reviewScore: 88,
        reviewCount: 345678,
        tags: ["Survival", "Open World", "Multiplayer", "Crafting"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 271590,
        name: "Grand Theft Auto V",
        currentPlayers: 145678,
        peakPlayers24h: 178901,
        allTimePeak: 364548,
        price: "$29.99",
        releaseDate: "Apr 14, 2015",
        reviewScore: 80,
        reviewCount: 1567890,
        tags: ["Open World", "Action", "Multiplayer", "Crime"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1817070,
        name: "Marvel Rivals",
        currentPlayers: 134567,
        peakPlayers24h: 167890,
        allTimePeak: 644269,
        price: "Free to Play",
        releaseDate: "Dec 6, 2024",
        reviewScore: 84,
        reviewCount: 234567,
        tags: ["Hero Shooter", "PvP", "Superhero", "Team-Based"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1091500,
        name: "Cyberpunk 2077",
        currentPlayers: 98765,
        peakPlayers24h: 123456,
        allTimePeak: 1054388,
        price: "$59.99",
        releaseDate: "Dec 10, 2020",
        reviewScore: 79,
        reviewCount: 678901,
        tags: ["RPG", "Open World", "Cyberpunk", "Sci-fi"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 1245620,
        name: "ELDEN RING",
        currentPlayers: 87654,
        peakPlayers24h: 109876,
        allTimePeak: 953426,
        price: "$59.99",
        releaseDate: "Feb 25, 2022",
        reviewScore: 91,
        reviewCount: 789012,
        tags: ["Souls-like", "RPG", "Dark Fantasy", "Difficult"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
        lastUpdated: now,
      },
      {
        appId: 252490,
        name: "Rust",
        currentPlayers: 76543,
        peakPlayers24h: 98765,
        allTimePeak: 244394,
        price: "$39.99",
        releaseDate: "Feb 8, 2018",
        reviewScore: 74,
        reviewCount: 890123,
        tags: ["Survival", "Crafting", "Multiplayer", "Open World"],
        headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg",
        lastUpdated: now,
      },
    ];

    for (const game of seedGames) {
      await ctx.db.insert("games", game);
      
      const baseTime = now - 24 * 60 * 60 * 1000;
      for (let i = 0; i < 24; i++) {
        const variance = Math.random() * 0.3 - 0.15;
        const playerCount = Math.floor(game.currentPlayers * (1 + variance));
        
        await ctx.db.insert("playerHistory", {
          appId: game.appId,
          playerCount,
          timestamp: baseTime + (i * 60 * 60 * 1000),
        });
      }
    }

    return { message: "Cleared old data and seeded 10 games with full metadata and 24h history" };
  },
});
