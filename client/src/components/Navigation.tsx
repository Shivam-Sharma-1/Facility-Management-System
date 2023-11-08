import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Avatar, Divider, ListItemIcon, Typography } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ApprovalIcon from "@mui/icons-material/Approval";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { NavLink } from "react-router-dom";

const Navigation = (): JSX.Element => {
  const auth = useAuth();
  const role = auth?.user?.role;

  const mutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:3000/auth/logout", {
        withCredentials: true,
      }),
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-[20%] h-full min-h-[100dvh] bg-primary text-white pt-8 overflow-y-hidden sticky top-0">
      <div className="w-full flex justify-left px-4 pl-8 pt-4 pb-8 gap-8 flex-wrap">
        <Avatar
          sx={{ width: "80px", height: "80px" }}
          src={auth?.user?.image}
          alt="avatar-image"
        />
        <div className="w-fit flex flex-col justify-center">
          <Typography variant="h4">{auth?.user?.name}</Typography>
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
                    primary="Admin Facilities"
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
                    primary="Admin Bookings"
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
                  : "admin"
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
                    <ApprovalIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
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

        {role === "FACILITY_MANAGER" && (
          <>
            <NavLink to="/facility/bookings">
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
                    <CollectionsBookmarkIcon
                      sx={{ width: "26px", height: "26px", color: "white" }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      variant: "h6",
                      component: "li",
                    }}
                    primary="Bookings"
                  />
                </ListItemButton>
              )}
            </NavLink>
            <Divider color="#0c0051" />
          </>
        )}

        {(role === "GROUP_DIRECTOR" || role === "FACILITY_MANAGER") && (
          <>
            <NavLink to="/report">
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
