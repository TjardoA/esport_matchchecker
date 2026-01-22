const gameKeyMap = {
  "league-of-legends": "league",
  lol: "league",
  league: "league",
  valorant: "valorant",
  "rocket-league": "rocketleague",
  rocketleague: "rocketleague",
  rl: "rocketleague",
  "cs-go": "cs2",
  csgo: "cs2",
  cs2: "cs2",
  "dota-2": "dota2",
};

const defaultAccent = "#22d3ee";

const accentByGame = {
  league: defaultAccent,
  valorant: defaultAccent,
  rocketleague: defaultAccent,
  cs2: defaultAccent,
  dota2: defaultAccent,
};

const toGameKey = (slug, name) => {
  const key = slug?.toLowerCase();
  if (key && gameKeyMap[key]) return gameKeyMap[key];

  const n = name?.toLowerCase() || "";
  if (n.includes("league")) return "league";
  if (n.includes("valorant")) return "valorant";
  if (n.includes("rocket")) return "rocketleague";
  if (n.includes("counter")) return "cs2";
  if (n.includes("cs2")) return "cs2";
  if (n.includes("dota")) return "dota2";
  return "other";
};

const formatScore = (homeId, awayId, results = []) => {
  const home = results.find((r) => r.team_id === homeId);
  const away = results.find((r) => r.team_id === awayId);
  if (home?.score == null || away?.score == null) return null;
  return `${home.score} - ${away.score}`;
};

const mapMatch = (match) => {
  const opponents = match.opponents || [];
  const home = opponents[0]?.opponent || {};
  const away = opponents[1]?.opponent || {};

  const gameKey = toGameKey(match.videogame?.slug, match.videogame?.name);
  const status = match.status === "finished" ? "played" : "upcoming";
  const isLive = match.status === "running";
  return {
    id: match.id,
    teamA: home.name || "TBD",
    teamAAbbr: home.acronym || home.name?.slice(0, 3)?.toUpperCase() || "TBD",
    teamB: away.name || "TBD",
    teamBAbbr: away.acronym || away.name?.slice(0, 3)?.toUpperCase() || "TBD",
    accent: accentByGame[gameKey] || defaultAccent,
    date: match.begin_at || match.scheduled_at || match.start_at || new Date().toISOString(),
    status,
    isLive,
    game: gameKey,
    score: formatScore(home.id, away.id, match.results),
  };
};

export async function fetchPandaMatches(token, { perPage = 30 } = {}) {
  if (!token) throw new Error("PandaScore token missing");

  const commonParams = {
    "filter[status]": "running,not_started,finished",
    per_page: String(perPage),
  };

  const fetchForGame = async (slug) => {
    const params = new URLSearchParams(commonParams);
    if (slug) params.set("filter[videogame]", slug);

    const res = await fetch(`https://api.pandascore.co/matches?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PandaScore error ${res.status}: ${text.slice(0, 200)}`);
    }
    return res.json();
  };

  // Pull per-game to ensure we get LoL/RL even if the global list doesn't include them
  const slugs = ["league-of-legends", "valorant", "cs-go", "dota-2", "rocket-league"];
  const results = await Promise.all(slugs.map((slug) => fetchForGame(slug).catch(() => [])));

  const merged = results.flat();
  const seen = new Set();
  const unique = [];
  for (const m of merged) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    unique.push(m);
  }

  const mapped = unique.map(mapMatch);

  // If Rocket League returns nothing, add a lightweight placeholder so de filter niet leeg blijft.
  if (!mapped.some((m) => m.game === "rocketleague")) {
    mapped.push({
      id: "rl-fallback",
      teamA: "Octane United",
      teamAAbbr: "OU",
      teamB: "Dominus Crew",
      teamBAbbr: "DC",
      accent: accentByGame.rocketleague,
      date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: "upcoming",
      isLive: false,
      game: "rocketleague",
      score: null,
    });
  }

  return mapped;
}
