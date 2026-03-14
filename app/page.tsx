"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import GameChart from "./GameChart";
import MiniSparkline from "./MiniSparkline";

function TableSparkline({ appId }: { appId: number }) {
  const history = useQuery(api.steam.getGameHistory, { appId, hours: 24 });
  
  if (!history || history.length === 0) {
    return <div className="w-[60px] h-[20px] bg-white/5 rounded" />;
  }

  // Sample data to 24 points (1 per hour)
  const sampledData = history.length > 24 
    ? history.filter((_, i) => i % Math.ceil(history.length / 24) === 0).slice(0, 24)
    : history;
  
  const playerCounts = sampledData.map(h => h.playerCount);
  
  return <MiniSparkline data={playerCounts} width={60} height={20} />;
}

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const games = useQuery(api.steam.getTopGames, { limit: viewMode === 'table' ? 100 : 20 });
  const [justUpdated, setJustUpdated] = useState(false);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  useEffect(() => {
    if (games && games.length > 0) {
      setJustUpdated(true);
      const timer = setTimeout(() => setJustUpdated(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [games]);

  const totalPlayers = games?.reduce((sum, game) => sum + game.currentPlayers, 0) || 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">🎮</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Steam Analytics
                </h1>
                <p className="text-xs text-gray-500">Realtime Player Tracking</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    viewMode === 'table'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Table
                </button>
              </div>

              {justUpdated && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-2">Total Players Online</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {totalPlayers.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-2">Games Tracked</div>
            <div className="text-3xl font-bold text-white">
              {games?.length || 0}
            </div>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-sm text-gray-400 mb-2">Update Frequency</div>
            <div className="text-3xl font-bold text-white">
              1<span className="text-lg text-gray-500">min</span>
            </div>
          </div>
        </div>

        {/* Events & Discounts Widget */}
        {games && games.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400 text-lg">🎉</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Active Discounts</h3>
                  <p className="text-xs text-gray-500">Games on sale now</p>
                </div>
              </div>
              <div className="space-y-2">
                {games.filter(g => g.discountPercent && g.discountPercent > 0).length > 0 ? (
                  games.filter(g => g.discountPercent && g.discountPercent > 0).slice(0, 3).map(game => (
                    <div key={game.appId} className="flex items-center justify-between text-xs">
                      <span className="text-gray-300 truncate flex-1">{game.name}</span>
                      <span className="text-green-400 font-bold ml-2">-{game.discountPercent}%</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No active discounts</p>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 text-lg">📰</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Latest News</h3>
                  <p className="text-xs text-gray-500">Recent updates</p>
                </div>
              </div>
              <div className="space-y-2">
                {games.filter(g => g.latestNews).length > 0 ? (
                  games.filter(g => g.latestNews).slice(0, 3).map(game => (
                    <div key={game.appId} className="text-xs">
                      <span className="text-gray-400 font-medium">{game.name}:</span>
                      <p className="text-gray-500 line-clamp-1">{game.latestNews}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No recent news</p>
                )}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-purple-400 text-lg">🔥</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Trending</h3>
                  <p className="text-xs text-gray-500">Biggest player counts</p>
                </div>
              </div>
              <div className="space-y-2">
                {games.slice(0, 3).map((game, idx) => (
                  <div key={game.appId} className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 truncate flex-1">#{idx + 1} {game.name}</span>
                    <span className="text-purple-400 font-bold ml-2">
                      {(game.currentPlayers / 1000).toFixed(0)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Games Grid */}
        {!games ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/10 border-t-white/60 rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading Steam data...</p>
            </div>
          </div>
        ) : games.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-2">Waiting for first data fetch...</p>
            <p className="text-gray-600 text-sm">The cron job will fetch player counts within 5 minutes</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300">Top Games by Players</h2>
              <div className="text-sm text-gray-500">
                Last updated: {new Date(games[0]?.lastUpdated || Date.now()).toLocaleTimeString()}
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {games.map((game, index) => (
                <Link
                  key={game.appId}
                  href={`/game/${game.appId}`}
                  className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-xl overflow-hidden transition-all h-[180px] block"
                >
                  <div className="flex h-full">
                    {/* Left side - Game info */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        {game.headerImage ? (
                          <div className="flex-shrink-0 w-20 h-10 rounded overflow-hidden border border-white/10">
                            <img 
                              src={game.headerImage} 
                              alt={game.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded flex items-center justify-center border border-white/5">
                            <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-sm truncate">{game.name}</h3>
                            {game.discountPercent && game.discountPercent > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-[10px] text-green-300 font-bold whitespace-nowrap">
                                  -{game.discountPercent}%
                                </span>
                                {game.price && (
                                  <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300 whitespace-nowrap">
                                    {game.price}
                                  </span>
                                )}
                              </div>
                            ) : game.price ? (
                              <span className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-300 whitespace-nowrap">
                                {game.price}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            {game.releaseDate && <span>{game.releaseDate}</span>}
                            {game.reviewScore && (
                              <span className="flex items-center gap-0.5">
                                <span className="text-white">★</span>
                                {game.reviewScore}%
                              </span>
                            )}
                          </div>
                          {game.latestNews && (
                            <div className="mt-1.5 text-[10px] text-gray-400 line-clamp-1">
                              📰 {game.latestNews}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {game.tags && game.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap mb-3">
                          {game.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-auto grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">Current</div>
                          <div className="text-sm font-bold text-white">
                            {(game.currentPlayers / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 mb-0.5">24h Peak</div>
                          <div className="text-sm font-bold text-gray-300">
                            {(game.peakPlayers24h / 1000).toFixed(0)}k
                          </div>
                        </div>
                        {game.allTimePeak && (
                          <div>
                            <div className="text-[10px] text-gray-500 mb-0.5">All-Time</div>
                            <div className="text-sm font-bold text-gray-400">
                              {(game.allTimePeak / 1000).toFixed(0)}k
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Right side - Mini chart */}
                    <div className="w-[280px] border-l border-white/5 p-3">
                      <GameChart appId={game.appId} gameName={game.name} compact={true} />
                    </div>
                  </div>
                </Link>
              ))}
              </div>
            ) : (
              // Table View
              <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">#</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Game</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Tags</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Developer</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400">Current Players</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400">24h Peak</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400">24h Trend</th>
                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400">All-Time Peak</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Price</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Release Date</th>
                        <th className="text-center py-3 px-4 text-xs font-semibold text-gray-400">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game, index) => (
                        <tr
                          key={game.appId}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                          onClick={() => window.location.href = `/game/${game.appId}`}
                        >
                          <td className="py-3 px-4 text-sm text-gray-400">#{index + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {game.headerImage && (
                                <img
                                  src={game.headerImage}
                                  alt={game.name}
                                  className="w-12 h-6 object-cover rounded border border-white/10"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-white">{game.name}</div>
                                {game.genres && game.genres.length > 0 && (
                                  <div className="text-xs text-gray-500">{game.genres.slice(0, 2).join(', ')}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {game.tags && game.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {game.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-400"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-300">
                            {game.developers ? game.developers[0] : '-'}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm font-bold text-white">
                              {game.currentPlayers.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm font-medium text-blue-400">
                              {game.peakPlayers24h.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-center">
                              <TableSparkline appId={game.appId} />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="text-sm font-medium text-purple-400">
                              {game.allTimePeak ? game.allTimePeak.toLocaleString() : '-'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {game.discountPercent && game.discountPercent > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/40 rounded text-xs text-green-300 font-bold">
                                  -{game.discountPercent}%
                                </span>
                                <span className="text-xs text-white font-medium">{game.price}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300">{game.price || '-'}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-xs text-gray-400">
                            {game.releaseDate || '-'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {game.reviewScore ? (
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm font-medium text-white">{game.reviewScore}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}