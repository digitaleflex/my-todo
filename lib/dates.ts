/**
 * Convention dates V1 : les échéances sont des jours calendaires stockés
 * à minuit UTC (via <input type="date">). "Aujourd'hui" et "en retard"
 * sont calculés sur des frontières UTC. Le fuseau utilisateur
 * personnalisable arrivera avec les paramètres (#10).
 */
export function dayBoundsUTC(now: Date = new Date()): { dayStart: Date; dayEnd: Date } {
  const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  return { dayStart, dayEnd };
}

export function formatTodayFR(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(now);
}
