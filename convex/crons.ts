import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "fetch steam player counts",
  { minutes: 30 },
  internal.fetchSteamData.fetchAndUpdate
);

export default crons;
