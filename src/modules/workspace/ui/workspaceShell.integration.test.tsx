import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { resetMockTicketsForTests } from "@/modules/tickets/api/ticketsApi";
import { renderWithProviders } from "@/shared/testing/renderWithProviders";
import { routeConfig } from "@/app/router/router";

function renderAt(pathname: string) {
  const router = createMemoryRouter(routeConfig, {
    initialEntries: [pathname],
  });

  return renderWithProviders(<RouterProvider router={router} />);
}

const openAndClose = async (user: UserEvent, ticketNumber: string) => {
  let list = await screen.findByRole("list", { name: /ticket queue/i });
  const firstLink = await within(list).findByRole("link", {
    name: new RegExp(ticketNumber),
  });

  await user.click(firstLink);

  let backLink = await screen.findByRole("link", { name: /back to queue/i });
  await user.click(backLink);
};

describe("WorkspaceShell integration tests", () => {
  beforeEach(() => {
    resetMockTicketsForTests();
  });

  it("workspaceShell - no recent tickets", async () => {
    const user = userEvent.setup();

    renderAt("/tickets");

    expect(await screen.findByText("Recently opened")).toBeInTheDocument();
    expect(
      await screen.findByText("No recently opened tickets"),
    ).toBeInTheDocument();
  });

  it("workspaceShell - 3 recent tickets", async () => {
    const user = userEvent.setup();

    renderAt("/tickets");

    await openAndClose(user, "TCK-1001");
    await openAndClose(user, "TCK-1002");
    await openAndClose(user, "TCK-1003");

    const recentTicketsList = await screen.findByRole("list", {
      name: /recently opened queue/i,
    });

    const firstRecentTicket = await within(recentTicketsList).findByRole(
      "link",
      { name: /TCK-1001/ },
    );
    const secondRecentTicket = await within(recentTicketsList).findByRole(
      "link",
      { name: /TCK-1002/ },
    );
    const thirdRecentTicket = await within(recentTicketsList).findByRole(
      "link",
      { name: /TCK-1003/ },
    );

    expect(firstRecentTicket).toBeInTheDocument();
    expect(secondRecentTicket).toBeInTheDocument();
    expect(thirdRecentTicket).toBeInTheDocument();
  });

  it("Command palette - opens with Ctrl/⌘ K and marks current ticket reviewed", async () => {
    const user = userEvent.setup();

    renderAt("/tickets/TCK-1001");

    expect(
      await screen.findByText(/TCK-1001 · Cannot connect to VPN/),
    ).toBeInTheDocument();
    expect(screen.getByText("new")).toBeInTheDocument();

    await user.keyboard("{Control>}k{/Control}");

    expect(
      await screen.findByRole("heading", { name: /command palette/i }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole("combobox"), "reviewed");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("reviewed")).toBeInTheDocument();
    });
  });
});
