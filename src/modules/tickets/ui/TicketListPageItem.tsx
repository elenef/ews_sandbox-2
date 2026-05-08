import { ListItemButton, ListItemText, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import { Ticket } from "../model/ticket.types";

export const TicketListPageItem = ({ ticket }: { ticket: Ticket }) => {
  return (
    <ListItemButton
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
  );
};
