import { useState } from 'react';

import { Avatar, ListItemIcon } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ApprovalIcon from '@mui/icons-material/Approval';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import EventIcon from '@mui/icons-material/Event';
import SummarizeIcon from '@mui/icons-material/Summarize';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const navigationData: NavigationData[] = [
  {
    label: 'Admin',
    icon: <AdminPanelSettingsIcon sx={{ width: "26px", height: "26px", color: "white" }} />,
    key: 'admin'
  },
  {
    label: 'Approval Status',
    icon: <ApprovalIcon sx={{ width: "26px", height: "26px", color: "white" }} />,
    key: 'approval'
  },
  {
    label: 'Bookings',
    icon: <BookmarksIcon sx={{ width: "26px", height: "26px", color: "white" }} />,
    key: 'bookings'
  },
  {
    label: 'Calender',
    icon: <EventIcon sx={{ width: "26px", height: "26px", color: "white" }} />,
    key: 'calender'
  },
  {
    label: 'Report',
    icon: <SummarizeIcon sx={{ width: "26px", height: "26px", color: "white" }} />,
    key: 'report'
  },
];

function Navigation(): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div
      className='w-[20%] h-full min-h-[100dvh] bg-primary text-white pt-8'
    >
      <div className='w-full flex justify-center px-4 pt-4 gap-4'>
        <Avatar sx={{ width: "80px", height: "80px" }} src='https://www.w3schools.com/howto/img_avatar.png' alt="avatar-image" />
        <div className='flex flex-col justify-center gap-2'>
          <h3>Shivam Sharma</h3>
          <h4 className='font-normal'>ID: 6551</h4>
        </div>
      </div>
      <div className='w-[92%] h-[1px] bg-slate-400 rounded-full mx-auto mt-6'></div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {navigationData.map(item => (
          <ListItemButton key={item.key} className='flex gap-4'>
            <ListItemIcon sx={{ minWidth: "0px" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        {/* <ListItemButton onClick={handleClick}>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton> */}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default Navigation;
