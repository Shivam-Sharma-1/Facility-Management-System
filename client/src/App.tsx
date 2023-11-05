import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import FacilityPage from "./pages/FacilityPage";
import { AuthProvider } from "./utils/auth";
import { RequireAuth } from "./components/RequireAuth";
import ApprovalsPage from "./pages/ApprovalsPage";
import "@tanstack/react-query";
import { AxiosError } from "axios";
import MyBookingsPage from "./pages/MyBookingsPage";
import BookingsPage from "./pages/BookingsPage";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route
        index
        element={
          <RequireAuth GD={false} FM={false}>
            <DashboardPage />
          </RequireAuth>
        }
      />

      <Route path="auth/login" element={<LoginPage />} />

      <Route path="facility">
        <Route
          path=":id"
          element={
            <RequireAuth GD={false} FM={false}>
              <FacilityPage />
            </RequireAuth>
          }
        />
        <Route
          path="bookings"
          element={
            <RequireAuth GD={false} FM={true}>
              <BookingsPage />
            </RequireAuth>
          }
        />
      </Route>

      <Route path="employee">
        <Route path="approvals">
          <Route
            path="gd"
            element={
              <RequireAuth GD={true} FM={false}>
                <ApprovalsPage GD={true} FM={false} />
              </RequireAuth>
            }
          />
          <Route
            path="fm"
            element={
              <RequireAuth GD={false} FM={true}>
                <ApprovalsPage GD={false} FM={true} />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="mybookings"
          element={
            <RequireAuth GD={false} FM={false}>
              <MyBookingsPage />
            </RequireAuth>
          }
        />
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
