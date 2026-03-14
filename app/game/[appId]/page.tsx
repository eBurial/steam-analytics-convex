"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import GameChart from "../../GameChart";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = parseInt(params.appId as string);
  
  const games = useQuery(api.steam.getTopGames, { limit: 100 });
  const game = games?.find(g => g.appId === appId);
  const history = useQuery(api.steam.getGameHistory, { appId, hours: 24 });

  if (!game) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/10 border-t-white/60 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading game details...</p>
        </div>
      </main>
    );
  }

  const stats = history && history.length > 0 ? {
    peak: Math.max(...history.map(h => h.playerCount)),
    low: Math.min(...history.map(h => h.playerCount)),
    avg: Math.round(history.reduce((sum, h) => sum + h.playerCount, 0) / history.length),
  } : null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition-all"
            >
              <span className="text-white text-xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{game.name}</h1>
              <p className="text-xs text-gray-500">App ID: {game.appId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-40 py-8">
        {/* Hero Section with Blurred Background */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          {/* Blurred Background Image */}
          {game.headerImage && (
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-30"
                style={{ backgroundImage: `url(${game.headerImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 flex w-full gap-x-8 justify-between p-8">
            {game.headerImage && (
              <div className="flex-1">
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm">
                  <img
                    src={game.headerImage}
                    alt={game.name}
                    className="w-full h-64 object-contain"
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {game.shortDescription && (
              <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  About This Game
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {game.shortDescription}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className=" flex gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">Current Players</div>
            <div className="text-3xl font-bold text-white">
              {game.currentPlayers.toLocaleString()}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <div className="text-sm text-gray-400 mb-2">24h Peak</div>
            <div className="text-3xl font-bold text-blue-400">
              {game.peakPlayers24h.toLocaleString()}
            </div>
          </div>

          {game.allTimePeak && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-2">All-Time Peak</div>
              <div className="text-3xl font-bold text-purple-400">
                {game.allTimePeak.toLocaleString()}
              </div>
            </div>
          )}

          {game.reviewScore && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
              <div className="text-sm text-gray-400 mb-2">Review Score</div>
              <div className="text-3xl font-bold text-green-400">
                {game.reviewScore}%
              </div>
              {game.reviewCount && (
                <div className="text-xs text-gray-500 mt-1">
                  {(game.reviewCount / 1000).toFixed(0)}k reviews
                </div>
              )}
            </div>
          )}
        </div>

        {/* Screenshots */}
        {game.screenshots && game.screenshots.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {game.screenshots.map((screenshot, idx) => (
                <div
                  key={idx}
                  className="rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all"
                >
                  <img
                    src={screenshot}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              Game Information
            </h2>
            <div className="space-y-4">
              {game.developers && game.developers.length > 0 && (
                <div className="flex items-start justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Developer</span>
                  <span className="text-white font-medium text-right">
                    {game.developers.join(", ")}
                  </span>
                </div>
              )}

              {game.publishers && game.publishers.length > 0 && (
                <div className="flex items-start justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Publisher</span>
                  <span className="text-white font-medium text-right">
                    {game.publishers.join(", ")}
                  </span>
                </div>
              )}

              {game.releaseDate && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Release Date</span>
                  <span className="text-white font-medium">
                    {game.releaseDate}
                  </span>
                </div>
              )}

              {game.price && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Price</span>
                  <div className="flex items-center gap-2">
                    {game.discountPercent && game.discountPercent > 0 ? (
                      <>
                        <span className="px-2 py-1 bg-green-500/20 border border-green-500/40 rounded text-sm text-green-300 font-bold">
                          -{game.discountPercent}%
                        </span>
                        {game.originalPrice && (
                          <span className="text-gray-500 line-through text-sm">
                            {game.originalPrice}
                          </span>
                        )}
                        <span className="text-white font-bold">
                          {game.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-white font-medium">
                        {game.price}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {game.metacriticScore && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Metacritic Score</span>
                  <span
                    className={`text-xl font-bold ${game.metacriticScore >= 75 ? "text-green-400" : game.metacriticScore >= 50 ? "text-yellow-400" : "text-red-400"}`}
                  >
                    {game.metacriticScore}
                  </span>
                </div>
              )}

              {game.website && (
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-400">Website</span>
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm truncate max-w-xs"
                  >
                    {game.website}
                  </a>
                </div>
              )}

              {game.genres && game.genres.length > 0 && (
                <div className="border-b border-white/5 pb-3">
                  <span className="text-gray-400 block mb-2">Genres</span>
                  <div className="flex gap-2 flex-wrap">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.categories && game.categories.length > 0 && (
                <div className="border-b border-white/5 pb-3">
                  <span className="text-gray-400 block mb-2">Features</span>
                  <div className="flex gap-2 flex-wrap">
                    {game.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-sm text-purple-300"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.tags && game.tags.length > 0 && (
                <div className="border-b border-white/5 pb-3">
                  <span className="text-gray-400 block mb-2">Tags</span>
                  <div className="flex gap-1 flex-wrap">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.supportedLanguages &&
                game.supportedLanguages.length > 0 && (
                  <div className="border-b border-white/5 pb-3">
                    <span className="text-gray-400 block mb-2">
                      Supported Languages
                    </span>
                    <div className="text-sm text-gray-300">
                      {game.supportedLanguages.slice(0, 8).join(", ")}
                      {game.supportedLanguages.length > 8 &&
                        ` +${game.supportedLanguages.length - 8} more`}
                    </div>
                  </div>
                )}

              {game.latestNews && (
                <div>
                  <span className="text-gray-400 block mb-2">Latest News</span>
                  <p className="text-white">{game.latestNews}</p>
                  {game.newsDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(game.newsDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              24h Statistics
            </h2>
            {stats ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Peak Players</div>
                  <div className="text-2xl font-bold text-white">
                    {stats.peak.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Average Players
                  </div>
                  <div className="text-2xl font-bold text-gray-300">
                    {stats.avg.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">
                    Lowest Players
                  </div>
                  <div className="text-2xl font-bold text-gray-400">
                    {stats.low.toLocaleString()}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                  <div className="text-sm text-white">
                    {new Date(game.lastUpdated).toLocaleString()}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No statistics available</p>
            )}
          </div>
        </div>

        {/* Player Count Chart */}
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Player Count History
          </h2>
          <GameChart appId={game.appId} gameName={game.name} compact={false} />
        </div>
      </div>
    </main>
  );
}
