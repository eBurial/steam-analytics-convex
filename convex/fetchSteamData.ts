import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Note: This endpoint requires a Steam access token
// You can get one by logging into Steam and extracting it from the browser
// The token should be stored in environment variables for security
const STEAM_ACCESS_TOKEN = process.env.STEAM_ACCESS_TOKEN || "";

export const fetchAndUpdate = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      // Fetch top games by concurrent players from Steam Charts API
      let topGames: Array<{ appid: number; name: string; concurrent_in_game: number }> = [];
      
      if (STEAM_ACCESS_TOKEN) {
        try {
          const params = {
            access_token: STEAM_ACCESS_TOKEN,
            input_json: JSON.stringify({
              context: {
                language: 'en',
                elanguage: 'en',
                country_code: 'US',
                steam_realm: '1',
              },
              data_request: {
                include_assets: true,
                include_platforms: true,
                include_basic_info: true,
                include_tag_count: 20,
              },
            }),
          };

          const response = await fetch(
            `https://api.steampowered.com/ISteamChartsService/GetGamesByConcurrentPlayers/v1/?${new URLSearchParams(params).toString()}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.response?.ranks) {
              topGames = data.response.ranks.slice(0, 20).map((rank: any) => ({
                appid: rank.appid,
                name: rank.item?.name || `Game ${rank.appid}`,
                concurrent_in_game: rank.concurrent_in_game,
              }));
              console.log(`Fetched ${topGames.length} top games from Steam Charts API`);
            }
          }
        } catch (error) {
          console.error("Error fetching from Steam Charts API:", error);
        }
      }

      // Fallback to hardcoded list if API fails or no token
      if (topGames.length === 0) {
        console.log("Using fallback game list");
        topGames = [
          { appid: 730, name: "Counter-Strike 2", concurrent_in_game: 0 },
          { appid: 570, name: "Dota 2", concurrent_in_game: 0 },
          { appid: 1203220, name: "NARAKA: BLADEPOINT", concurrent_in_game: 0 },
          { appid: 252490, name: "Rust", concurrent_in_game: 0 },
          { appid: 1172470, name: "Apex Legends", concurrent_in_game: 0 },
          { appid: 271590, name: "Grand Theft Auto V", concurrent_in_game: 0 },
          { appid: 1623730, name: "Palworld", concurrent_in_game: 0 },
          { appid: 2399830, name: "Delta Force", concurrent_in_game: 0 },
          { appid: 2357570, name: "Banana", concurrent_in_game: 0 },
          { appid: 1938090, name: "Call of Duty: Black Ops 6", concurrent_in_game: 0 },
        ];
      }

      for (const game of topGames) {
        try {
          const response = await fetch(
            `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${game.appid}`
          );

          if (!response.ok) {
            console.error(`Failed to fetch data for ${game.name}:`, response.statusText);
            continue;
          }

          const data = await response.json();
          
          if (data.response && data.response.player_count !== undefined) {
            // Fetch game details from Steam Store API for comprehensive metadata
            let headerImage = undefined;
            let price = undefined;
            let releaseDate = undefined;
            let developers = undefined;
            let publishers = undefined;
            let genres = undefined;
            let categories = undefined;
            let shortDescription = undefined;
            let screenshots = undefined;
            let website = undefined;
            let supportedLanguages = undefined;
            let metacriticScore = undefined;
            
            try {
              const storeResponse = await fetch(
                `https://store.steampowered.com/api/appdetails?appids=${game.appid}`
              );
              
              if (storeResponse.ok) {
                const storeData = await storeResponse.json();
                const gameData = storeData[game.appid];
                
                if (gameData?.success && gameData.data) {
                  const d = gameData.data;
                  
                  headerImage = d.header_image;
                  
                  if (d.is_free) {
                    price = "Free to Play";
                  } else if (d.price_overview) {
                    price = d.price_overview.final_formatted;
                  }
                  
                  if (d.release_date?.date) {
                    releaseDate = d.release_date.date;
                  }
                  
                  developers = d.developers || undefined;
                  publishers = d.publishers || undefined;
                  
                  if (d.genres) {
                    genres = d.genres.map((g: any) => g.description);
                  }
                  
                  if (d.categories) {
                    categories = d.categories.map((c: any) => c.description).slice(0, 10);
                  }
                  
                  shortDescription = d.short_description || undefined;
                  
                  if (d.screenshots && d.screenshots.length > 0) {
                    screenshots = d.screenshots.slice(0, 5).map((s: any) => s.path_thumbnail);
                  }
                  
                  website = d.website || undefined;
                  
                  if (d.supported_languages) {
                    const langText = d.supported_languages.replace(/<[^>]*>/g, '');
                    supportedLanguages = langText.split(',').map((l: string) => l.trim()).slice(0, 10);
                  }
                  
                  if (d.metacritic?.score) {
                    metacriticScore = d.metacritic.score;
                  }
                  
                  // Calculate review score from Steam recommendations
                  // Steam doesn't provide a direct percentage, so we calculate from total reviews
                  // This is an approximation based on the review summary
                  if (d.recommendations?.total) {
                    // Use a rough estimate: if game has recommendations, assume ~70-90% positive
                    // For more accurate data, we'd need the Steam Reviews API
                    // For now, we'll keep existing review scores if they exist (from seed data)
                    // and only set for new games without scores
                  }
                }
              }
            } catch (storeError) {
              console.log(`Could not fetch store data for ${game.name}`);
            }
            
            // Fetch review data from Steam Reviews API
            let reviewScore = undefined;
            let reviewCount = undefined;
            
            try {
              const reviewResponse = await fetch(
                `https://store.steampowered.com/appreviews/${game.appid}?json=1&language=all&purchase_type=all`
              );
              
              if (reviewResponse.ok) {
                const reviewData = await reviewResponse.json();
                if (reviewData.success === 1 && reviewData.query_summary) {
                  const summary = reviewData.query_summary;
                  // Calculate percentage from positive/total reviews
                  if (summary.total_reviews > 0) {
                    reviewScore = Math.round((summary.total_positive / summary.total_reviews) * 100);
                    reviewCount = summary.total_reviews;
                  }
                }
              }
            } catch (reviewError) {
              console.log(`Could not fetch reviews for ${game.name}`);
            }
            
            // Fetch latest news for this game
            let latestNews = undefined;
            let newsDate = undefined;
            
            try {
              const newsResponse = await fetch(
                `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${game.appid}&count=1&maxlength=200`
              );
              
              if (newsResponse.ok) {
                const newsData = await newsResponse.json();
                if (newsData.appnews?.newsitems && newsData.appnews.newsitems.length > 0) {
                  const news = newsData.appnews.newsitems[0];
                  latestNews = news.title;
                  newsDate = news.date * 1000; // Convert Unix timestamp to milliseconds
                }
              }
            } catch (newsError) {
              console.log(`Could not fetch news for ${game.name}`);
            }
            
            await ctx.runMutation(internal.steam.updateGame, {
              appId: game.appid,
              name: game.name,
              currentPlayers: data.response.player_count,
              headerImage,
              price,
              releaseDate,
              latestNews,
              newsDate,
              developers,
              publishers,
              genres,
              categories,
              shortDescription,
              screenshots,
              website,
              supportedLanguages,
              metacriticScore,
              reviewScore,
              reviewCount,
            });
          }
        } catch (error) {
          console.error(`Error fetching ${game.name}:`, error);
        }
      }

      console.log(`Updated Steam data at ${new Date().toISOString()}`);
    } catch (error) {
      console.error("Error in fetchAndUpdate:", error);
    }
  },
});
