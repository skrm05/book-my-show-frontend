import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Home } from "../pages/public/Home";
import { Login } from "../pages/auth/Login";
import { MovieDetails } from "../pages/public/MovieDetails";
import { SeatSelection } from "../pages/booking/SeatSelection";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Profile } from "../pages/profile/Profile";
import { FindBooking } from "../pages/booking/FindBooking";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserRole } from "../types";
import { AddMovie } from "../pages/dashboard/AddMovie";
import { AddShow } from "../pages/dashboard/AddShow";
import { AddTheatre } from "../pages/dashboard/AddTheatre";
import { AddLocation } from "../pages/dashboard/AddLocation";
import { Register } from "../pages/auth/Register";
import { ManageEntities } from "../pages/dashboard/ManageEntities";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "movie/:id", element: <MovieDetails /> },
      {
        path: "book/:showId",
        element: (
          <ProtectedRoute
            allowedRoles={[
              UserRole.USER,
              UserRole.SUPER_ADMIN,
              UserRole.THEATRE_ADMIN,
            ]}
          >
            <SeatSelection />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.THEATRE_ADMIN]}
          >
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/add-movie",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.THEATRE_ADMIN]}
          >
            <AddMovie />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/add-show",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.THEATRE_ADMIN]}
          >
            <AddShow />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/add-location",
        element: (
          <ProtectedRoute allowedRoles={[UserRole.SUPER_ADMIN]}>
            <AddLocation />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/add-theatre",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.THEATRE_ADMIN]}
          >
            <AddTheatre />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/manage",
        element: (
          <ProtectedRoute
            allowedRoles={[UserRole.SUPER_ADMIN, UserRole.THEATRE_ADMIN]}
          >
            <ManageEntities />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "bookings",
        element: (
          <ProtectedRoute>
            <FindBooking />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
