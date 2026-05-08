import {
  Box,
  List,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useGetTicketsQuery } from "../api/ticketsApi";
import type { TicketStatus } from "../model/ticket.types";
import { TicketListPageItem } from "./TicketListPageItem";
import { useRecentTickets } from "../hooks/useRecentTickets";

const statusOptions: Array<TicketStatus | "all"> = [
  "all",
  "new",
  "in-progress",
  "reviewed",
];

export function TicketListPage() {
  const { data: tickets = [], isLoading } = useGetTicketsQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const recentTickets = useRecentTickets(tickets);

  const status = (searchParams.get("status") ?? "all") as TicketStatus | "all";

  const filteredTickets =
    status === "all"
      ? tickets
      : tickets.filter((ticket) => ticket.status === status);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h5" component="h1">
          Ticket queue
        </Typography>
        <TextField
          select
          size="small"
          label="Status"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setSearchParams(nextStatus === "all" ? {} : { status: nextStatus });
          }}
          sx={{ minWidth: 180 }}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Recently opened</Typography>

        {recentTickets.length > 0 ? (
          <List aria-label="recently opened queue">
            {recentTickets.map((ticket) => (
              <TicketListPageItem
                key={ticket.id}
                ticket={ticket}
              ></TicketListPageItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" variant="body2">
            No recently opened tickets
          </Typography>
        )}
      </Paper>

      <Paper variant="outlined">
        <List aria-label="ticket queue">
          {isLoading ? (
            <ListItemText sx={{ p: 2 }} primary="Loading tickets" />
          ) : null}
          {filteredTickets.map((ticket) => (
            <TicketListPageItem
              key={ticket.id}
              ticket={ticket}
            ></TicketListPageItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
