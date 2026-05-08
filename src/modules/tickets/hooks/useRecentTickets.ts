import { readRecentTicketIds } from "@/modules/workspace/state/recentTicketStorage";
import { useMemo } from "react";
import { getTicketByIdMap } from "../model/ticket.selectors";
import { Ticket } from "../model/ticket.types";

export const useRecentTickets = (tickets: readonly Ticket[]): Ticket[] =>  {
    const recentIds = readRecentTicketIds();
    const ticketsById = useMemo(() => getTicketByIdMap(tickets), [tickets]);
  
    return recentIds
          .map((id) => ticketsById.get(id))
          .filter((ticket) => !!ticket);
};
  