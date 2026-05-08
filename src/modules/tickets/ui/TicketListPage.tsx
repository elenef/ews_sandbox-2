import {
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { useGetTicketsQuery } from "../api/ticketsApi";
import type { TicketStatus } from "../model/ticket.types";

const statusOptions: Array<TicketStatus | "all"> = [
  "all",
  "new",
  "in-progress",
  "reviewed",
];

export function TicketListPage() {
  const { data: tickets = [], isLoading } = useGetTicketsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
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
        <Typography color="text.secondary" variant="body2">
          Candidate task: show the last 3 opened tickets here.
        </Typography>
      </Paper>

      <Paper variant="outlined">
        <List aria-label="ticket queue">
          {isLoading ? (
            <ListItemText sx={{ p: 2 }} primary="Loading tickets" />
          ) : null}
          {filteredTickets.map((ticket) => (
            <ListItemButton
              key={ticket.id}
              component={Link}
              to={`/tickets/${ticket.id}`}
            >
              <ListItemText
                primary={`${ticket.id} · ${ticket.title}`}
                secondary={`${ticket.requesterName} · updated ${new Date(
                  ticket.updatedAt,
                ).toLocaleString()}`}
              />
              <Chip label={ticket.status} size="small" />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
