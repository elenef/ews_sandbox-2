import {
  getBrowserStorage,
  type KeyValueStorage,
} from "@/shared/browser/safeStorage";

export const RECENT_TICKETS_STORAGE_KEY = "ticket-workspace:recent-ticket-ids";
export const RECENT_TICKETS_LIMIT = 3;

export const readRecentTicketIds = (
  storage: KeyValueStorage | null = getBrowserStorage(),
  limit: number = RECENT_TICKETS_LIMIT,
  key: string = RECENT_TICKETS_STORAGE_KEY,
): string[] => {
  try {
    const rawValue = storage?.getItem(key);

    if (!rawValue) return [];
 
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) return [];

    const checkStringAndNonEmpty = (id: unknown): id is string => typeof id === "string" && id.trim().length > 0;

    return parsedValue
    .filter(checkStringAndNonEmpty)
    .map(id => id.trim())
    .slice(0, limit);
  } catch (error) {
    return [];
  }
};

export const rememberRecentTicketId = (
  ticketId: string,
  storage: KeyValueStorage | null = getBrowserStorage(),
  limit: number = RECENT_TICKETS_LIMIT,
  key: string = RECENT_TICKETS_STORAGE_KEY,
) => {
  const recentIds = readRecentTicketIds(storage, limit, key);
  const nextIds = [
    ticketId,
    ...recentIds.filter((recentId) => recentId !== ticketId),
  ].slice(0, limit);

  storage?.setItem(key, JSON.stringify(nextIds));
};
