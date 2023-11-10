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
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminFacilitiesPage from "./pages/AdminFacilitiesPage";
import Layout from "./components/Layout";
import CancellationsPage from "./pages/CancellationsPage";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError;
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <RequireAuth GD={false} FM={false}>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <RequireAuth GD={false} FM={false} noAdmin={true}>
              <DashboardPage />
            </RequireAuth>
          }
        />

        <Route path="facility">
          <Route
            path=":id"
            element={
              <RequireAuth GD={false} FM={false} noAdmin={true}>
                <FacilityPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route
          path="bookings"
          // element={
          //   <RequireAuth GD={false} FM={true} noAdmin={true}>
          //     <BookingsPage />
          //   </RequireAuth>
          // }
        >
          <Route
            path="gd"
            element={
              <RequireAuth GD={true} FM={false} noAdmin={true}>
                <BookingsPage GD={true} FM={false} />
              </RequireAuth>
            }
          />
          <Route
            path="fm"
            element={
              <RequireAuth GD={false} FM={true} noAdmin={true}>
                <BookingsPage GD={false} FM={true} />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="employee">
          <Route path="approvals">
            <Route
              path="gd"
              element={
                <RequireAuth GD={true} FM={false} noAdmin={true}>
                  <ApprovalsPage GD={true} FM={false} />
                </RequireAuth>
              }
            />
            <Route
              path="fm"
              element={
                <RequireAuth GD={false} FM={true} noAdmin={true}>
                  <ApprovalsPage GD={false} FM={true} />
                </RequireAuth>
              }
            />
          </Route>

          <Route path="cancellations">
            <Route
              path="gd"
              element={
                <RequireAuth GD={true} FM={false} noAdmin={true}>
                  <CancellationsPage GD={true} FM={false} />
                </RequireAuth>
              }
            />
            <Route
              path="fm"
              element={
                <RequireAuth GD={false} FM={true} noAdmin={true}>
                  <CancellationsPage GD={false} FM={true} />
                </RequireAuth>
              }
            />
          </Route>

          <Route
            path="mybookings"
            element={
              <RequireAuth GD={false} FM={false} noAdmin={true}>
                <MyBookingsPage />
              </RequireAuth>
            }
          />
        </Route>

        <Route path="admin">
          <Route
            path="bookings"
            element={
              <RequireAuth GD={false} FM={false} Admin={true}>
                <AdminBookingsPage />
              </RequireAuth>
            }
          />
          <Route
            path="facilities"
            element={
              <RequireAuth GD={false} FM={false} Admin={true}>
                <AdminFacilitiesPage />
              </RequireAuth>
            }
          />
        </Route>
      </Route>
    </>
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
