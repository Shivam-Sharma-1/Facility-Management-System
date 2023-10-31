import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { Avatar, ListItemIcon } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ApprovalIcon from "@mui/icons-material/Approval";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import EventIcon from "@mui/icons-material/Event";
import SummarizeIcon from "@mui/icons-material/Summarize";
import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useAuth } from "./hooks/useAuth";

const Navigation = (): JSX.Element => {
  // const [open, setOpen] = useState(false);

  // const handleClick = () => {
  //   setOpen(!open);
  // };
  const auth = useAuth();

  const navigationData: NavigationData[] = [
    {
      label: "Admin",
      icon: (
        <AdminPanelSettingsIcon
          sx={{ width: "26px", height: "26px", color: "white" }}
        />
      ),
      key: "admin",
      onClick: () => console.log("admin"),
    },
    {
      label: "Approval Status",
      icon: (
        <ApprovalIcon sx={{ width: "26px", height: "26px", color: "white" }} />
      ),
      key: "approval",
      onClick: () => console.log("approval"),
    },
    {
      label: "Bookings",
      icon: (
        <BookmarksIcon sx={{ width: "26px", height: "26px", color: "white" }} />
      ),
      key: "bookings",
      onClick: () => console.log("bookings"),
    },
    {
      label: "Calender",
      icon: (
        <EventIcon sx={{ width: "26px", height: "26px", color: "white" }} />
      ),
      key: "calender",
      onClick: () => console.log("calender"),
    },
    {
      label: "Report",
      icon: (
        <SummarizeIcon sx={{ width: "26px", height: "26px", color: "white" }} />
      ),
      key: "report",
      onClick: () => console.log("report"),
    },
    {
      label: "Logout",
      icon: (
        <LogoutIcon sx={{ width: "26px", height: "26px", color: "white" }} />
      ),
      key: "logout",
      onClick: () => {
        mutation.mutate();
        auth?.logout();
      },
    },
  ];

  const mutation = useMutation({
    mutationFn: () =>
      axios.post("http://localhost:3000/auth/logout", {
        withCredentials: true,
      }),
    onSuccess: () => {
      console.log("logout");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="w-[20%] h-full min-h-[100dvh] bg-primary text-white pt-8 overflow-y-hidden">
      <div className="w-full flex justify-center px-4 pt-4 gap-4 flex-wrap">
        <Avatar
          sx={{ width: "80px", height: "80px" }}
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="avatar-image"
        />
        <div className="w-fit flex flex-col justify-center gap-2">
          <h2>Shivam Sharma</h2>
          <h4 className="font-normal">ID: 6551</h4>
        </div>
      </div>
      <div className="w-[92%] h-[1px] bg-slate-400 rounded-full mx-auto mt-6"></div>
      <List component="nav" aria-labelledby="nested-list-subheader">
        {navigationData.map((item) => (
          <ListItemButton
            key={item.key}
            className="flex gap-4"
            onClick={() => item.onClick()}
          >
            <ListItemIcon sx={{ minWidth: "0px" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        {/* <ListItemButton onClick={handleClick}>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse> */}
      </List>
    </div>
  );
};

export default Navigation;
