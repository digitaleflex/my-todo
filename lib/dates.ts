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

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Lundi 00:00 UTC de la semaine contenant `now`, décalée de `weekOffset`.
 * Lundi premier jour (convention FR). Même convention UTC qu'aujourd'hui (V1).
 */
export function startOfWeekMondayUTC(now: Date = new Date(), weekOffset: number = 0): Date {
  const dayStart = dayBoundsUTC(now).dayStart;
  const dow = dayStart.getUTCDay(); // 0 = dimanche
  const daysSinceMonday = (dow + 6) % 7;
  return new Date(dayStart.getTime() + (weekOffset * 7 - daysSinceMonday) * DAY_MS);
}

export function weekDaysUTC(now: Date = new Date(), weekOffset: number = 0): Date[] {
  const monday = startOfWeekMondayUTC(now, weekOffset);
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getTime() + i * DAY_MS));
}

export function formatDayShortFR(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

export function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}
