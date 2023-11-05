import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  Avatar,
  Collapse,
  Divider,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import ApprovalIcon from "@mui/icons-material/Approval";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const Navigation = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const auth = useAuth();

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
      <div className="w-full flex justify-center px-4 pt-4 pb-8 gap-8 flex-wrap">
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

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        disablePadding
      >
        <ListItemButton
          onClick={handleClick}
          className="flex gap-4"
          sx={{ padding: "1em" }}
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
            primary="Approval Status"
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ paddingLeft: "1em", paddingBlock: "0.5em" }}
          >
            <ListItemButton>
              <ListItemText
                primaryTypographyProps={{
                  variant: "h6",
                  component: "li",
                }}
                primary="My Bookings"
              />
            </ListItemButton>
          </List>

          {auth?.user!.role !== "USER" && (
            <>
              <Divider color="#0c0051" />
              <Link
                to={`/employee/approvals/${
                  auth?.user!.role === "GROUP_DIRECTOR"
                    ? "gd"
                    : auth?.user!.role === "FACILITY_MANAGER"
                    ? "fm"
                    : "admin"
                }`}
                className="text-white"
              >
                <List
                  component="div"
                  disablePadding
                  sx={{ paddingLeft: "1em", paddingBlock: "0.5em" }}
                >
                  <ListItemButton>
                    <ListItemText
                      primaryTypographyProps={{
                        variant: "h6",
                        component: "li",
                      }}
                      primary="Approval Requests"
                    />
                  </ListItemButton>
                </List>
              </Link>
            </>
          )}
        </Collapse>
        <Divider color="#0c0051" />

        <ListItemButton className="flex gap-4" sx={{ padding: "1em" }}>
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
            primary="Bookings"
          />
        </ListItemButton>
        <Divider color="#0c0051" />

        <Link to="/" className="text-white">
          <ListItemButton className="flex gap-4" sx={{ padding: "1em" }}>
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
        </Link>
        <Divider color="#0c0051" />

        <ListItemButton className="flex gap-4" sx={{ padding: "1em" }}>
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
        <Divider color="#0c0051" />

        <ListItemButton
          className="flex gap-4"
          sx={{ padding: "1em" }}
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
