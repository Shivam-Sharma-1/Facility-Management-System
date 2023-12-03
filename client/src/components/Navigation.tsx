import { FC, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ApprovalIcon from "@mui/icons-material/Approval";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import PasswordIcon from "@mui/icons-material/Password";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import ErrorComponent from "./Error";
import { useAuth } from "../hooks/useAuth";

const Navigation: FC = (): JSX.Element => {
  const auth = useAuth();
  const role = auth?.user?.role;
  const [approvalCount, setApprovalCount] = useState<number>(0);
  const [cancellationCount, setCancellationCount] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: () =>
      axios.post(`${import.meta.env.VITE_APP_SERVER_URL}/auth/logout`, {
        withCredentials: true,
      }),
    onError: (error) => {
      console.log(error);
    },
  });

  const { data, isPending, isError, error } = useQuery<NavigationProps>({
    queryKey: ["navigation"],
    queryFn: async () => {
      const response = await axios.get<NavigationProps>(
        `${import.meta.env.VITE_APP_SERVER_URL}/dashboard/count/${
          auth?.user?.employeeId
        }`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    refetchInterval: 5 * 1000,
    gcTime: 0,
  });

  useEffect(() => {
    if (!isPending) {
      setApprovalCount(data!.approvalCount!);
      setCancellationCount(data!.cancellationCount!);
    }
  }, [data, isPending]);

  if (isError) {
    const errorData = error.response!.data as ErrorMessage;
    return (
      <ErrorComponent
        status={errorData.error.status!}
        message={errorData.error.message}
      />
    );
  }

  return (
    <div className="w-[400px] h-full min-h-[100dvh] bg-primary text-white pt-5 overflow-y-hidden sticky top-0">
      <div className="w-full flex flex-col justify-between items-center pt-4 pb-8 gap-2 flex-wrap">
        <Avatar
          sx={{ width: "80px", height: "80px" }}
          src={"/" + auth?.user?.image}
          alt="avatar-image"
        />
        <div className="w-fit flex flex-col justify-center">
          <Typography variant="h5">{auth?.user?.name}</Typography>
          <Typography variant="subtitle1" className="font-normal">
            ID: {auth?.user?.employeeId}
          </Typography>
        </div>
      </div>
      <Divider color="#0c0051" />

      <List component="nav" disablePadding>
        {role !== "ADMIN" && (
          <>
            <NavLink to="/">
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <WorkspacePremiumIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Facilities"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}

        {role === "ADMIN" && (
          <>
            <NavLink to="/admin/facilities">
              {({ isActive }) => (
                <ListItemButton
                  className={"flex gap-3"}
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <WorkspacePremiumIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Manage Facilities"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
            <NavLink to="/admin/bookings">
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <BookmarksIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Manage Bookings"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}

        {role !== "ADMIN" && (
          <>
            <NavLink to="/employee/mybookings">
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <BookmarksIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="My Bookings"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}
        {role !== "USER" && role !== "ADMIN" && (
          <>
            <NavLink
              to={`/employee/approvals/${
                role === "GROUP_DIRECTOR"
                  ? "gd"
                  : role === "FACILITY_MANAGER"
                  ? "fm"
                  : ""
              }`}
            >
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <Badge badgeContent={approvalCount} color="primary">
                      <ApprovalIcon
                        sx={{ width: "26px", height: "26px", color: "white" }}
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Approval Requests"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}
        {role !== "USER" && role !== "ADMIN" && (
          <>
            <NavLink
              to={`/employee/cancellations/${
                role === "GROUP_DIRECTOR"
                  ? "gd"
                  : role === "FACILITY_MANAGER"
                  ? "fm"
                  : ""
              }`}
            >
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <Badge badgeContent={cancellationCount} color="primary">
                      <EventBusyIcon
                        sx={{ width: "26px", height: "26px", color: "white" }}
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Cancellation Requests"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}

        {(role === "GROUP_DIRECTOR" || role === "FACILITY_MANAGER") && (
          <>
            <NavLink
              to={`/bookings/${
                role === "GROUP_DIRECTOR"
                  ? "gd"
                  : role === "FACILITY_MANAGER"
                  ? "fm"
                  : ""
              }`}
            >
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <SummarizeIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Report"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}
        {/* 
        {role === "ADMIN" && (
          <>
            <NavLink to="/auth/reset-password">
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <PasswordIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Reset Password"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}

        {role !== "ADMIN" && (
          <>
            <NavLink to="/auth/login">
              {({ isActive }) => (
                <ListItemButton
                  className="flex gap-3"
                  sx={{
                    paddingLeft: "1.4em",
                    paddingBlock: "1.4em",
                    borderLeft: isActive ? "4px solid white" : "",
                    color: "white",
                    backgroundColor: isActive
                      ? " rgb(255, 255, 255, 0.02)"
                      : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "0px" }}>
                    <AdminPanelSettingsIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Log in as admin"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )} */}

        <ListItemButton
          className="flex gap-3"
          sx={{
            paddingLeft: "1.4em",
            paddingBlock: "1.4em",
            color: "white",
          }}
          onClick={() => {
            mutation.mutate();
            auth?.logout();
          }}
        >
          <ListItemIcon sx={{ minWidth: "0px" }}>
            <LogoutIcon
              sx={{ width: "26px", height: "26px", color: "white" }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              variant: "h6",
              component: "li",
            }}
            primary="Logout"
          />
        </ListItemButton>
        <Divider color="#0c0051" />
      </List>
    </div>
  );
};

export default Navigation;
