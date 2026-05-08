import { describe, expect, it } from "vitest";
import {
  RECENT_TICKETS_STORAGE_KEY,
  readRecentTicketIds,
  rememberRecentTicketId,
} from "./recentTicketStorage";

const createMemoryStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
};

describe("recentTicketStorage", () => {
  it("remember 1 unique ticket", () => {
    const storage = createMemoryStorage();

    rememberRecentTicketId("TCK-1001", storage);

    expect(
      JSON.parse(storage.getItem(RECENT_TICKETS_STORAGE_KEY) ?? "[]"),
    ).toEqual(["TCK-1001"]);
  });

  it("keeps the latest 3 unique ticket ids", () => {
    const storage = createMemoryStorage();

    rememberRecentTicketId("TCK-1001", storage);
    rememberRecentTicketId("TCK-1002", storage);
    rememberRecentTicketId("TCK-1003", storage);
    rememberRecentTicketId("TCK-1004", storage);
    rememberRecentTicketId("TCK-1002", storage);

    expect(
      JSON.parse(storage.getItem(RECENT_TICKETS_STORAGE_KEY) ?? "[]"),
    ).toEqual(["TCK-1002", "TCK-1004", "TCK-1003"]);
    expect(readRecentTicketIds(storage)).toEqual([
      "TCK-1002",
      "TCK-1004",
      "TCK-1003",
    ]);
  });

  it("if localStorage = null, return tickets: []", () => {
    expect(readRecentTicketIds(null)).toEqual([]);
  });

  it("if no tickets in localStorage, return tickets: []", () => {
    const storage = createMemoryStorage();

    expect(readRecentTicketIds(storage)).toEqual([]);
  });


  it("if localStorage contains string (no array), return tickets: []", () => {
    const storage = createMemoryStorage();

    storage.setItem(RECENT_TICKETS_STORAGE_KEY, "dfgfDFGFF");

    expect(readRecentTicketIds(storage)).toEqual([]);
  });

  it("if localStorage contains json (no array), return tickets: []", () => {
    const storage = createMemoryStorage();

    storage.setItem(RECENT_TICKETS_STORAGE_KEY, JSON.stringify({ id: "dfgdf "}));

    expect(readRecentTicketIds(storage)).toEqual([]);
  });

  it("if localStorage contains array with invalid types", () => {
    const storage = createMemoryStorage();

    storage.setItem(RECENT_TICKETS_STORAGE_KEY, JSON.stringify([1, null, "TCK-1", ""]));

    expect(readRecentTicketIds(storage)).toEqual(["TCK-1"]);
  });

  it("if localStorage contains no string values for ids", () => {
    const storage = createMemoryStorage();

    rememberRecentTicketId(234 as any, storage);
    rememberRecentTicketId(null as any, storage);
    rememberRecentTicketId("TCK-1003", storage);

    expect(readRecentTicketIds(storage)).toEqual(["TCK-1003"]);
  });

  it("if localStorage contains empty values for ids", () => {
    const storage = createMemoryStorage();

    rememberRecentTicketId("   ", storage);
    rememberRecentTicketId("", storage);
    rememberRecentTicketId("TCK-1003", storage);

    expect(readRecentTicketIds(storage)).toEqual(["TCK-1003"]);
  });

});
