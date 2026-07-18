import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MatchIntelligencePage from "../features/match-intelligence";
import Dashboard from "../features/dashboard";
import AIAnalystPage from "../features/ai-analyst";
import LiveMatchesPage from "../features/live-matches/Index";
import PredictionsPage from "../features/predictions/Index";
import PremiumReportsPage from "../features/premium-reports";
import RewardsPage from "../features/rewards";
import TeamIntelligencePage from "../features/team-intelligence";
import PlayerIntelligencePage from "../features/player-intelligence";
import PlayerDetailPage from "../features/player-intelligence/PlayerDetailPage";
import TournamentIntelligencePage from "../features/tournament-intelligence";
import NotificationsPage from "../features/notifications/Index";
import SettingsPage from "../features/settings";
import { AppLayout } from "../app/layout";
import { AuthGuard } from "./guards/AuthGuard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppLayout />
  ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Suspense><Dashboard /></Suspense> },
      { path: 'match/:matchId', element: <Suspense><MatchIntelligencePage /></Suspense> },
      {
        path: 'ai-analyst',
        element: <AIAnalystPage />
      },
      {
        path: 'live',
        element: <LiveMatchesPage />,
      },
      {
        path: 'predictions',
        element: <PredictionsPage />,
      },
      {
        path: 'premium',
        element: <PremiumReportsPage />,
      },
      {
        path: 'rewards',
        element: <RewardsPage />,
      },
      {
        path: 'teams',
        element: <TeamIntelligencePage />
      },
      {
        path: 'teams/:teamId',
        element: <Suspense><TeamIntelligencePage /></Suspense>
      },
      {
        path: 'players',
        element: <PlayerIntelligencePage />
      },
      {
        path: 'players/:playerId',
        element: <Suspense><PlayerDetailPage /></Suspense>
      },
      {
        path: 'tournament',
        element: <TournamentIntelligencePage />
      },
      {
        path: 'notifications',
        element: <NotificationsPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ],
  },
]);
