import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { Avatar } from '@mui/material';

function Navigation() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div
      className='w-[20%] h-full min-h-[100dvh] bg-primary text-white'
    >
      <div className='w-full flex justify-center px-4 pt-4 gap-4'>
        <Avatar sx={{ width: "80px", height: "80px" }} src='https://www.w3schools.com/howto/img_avatar.png' alt="avatar-image" />
        <div className='flex flex-col justify-center gap-2'>
          <h2>Shivam Sharma</h2>
          <h4 className='font-normal'>ID: 6551</h4>
        </div>
      </div>
      <div className='w-[92%] h-[1px] bg-slate-400 rounded-full m-auto mt-4'></div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItemButton>
          <ListItemText primary="Admin" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Approval Status" />
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <ListItemText primary="Inbox" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton>
          <ListItemText primary="Bookings" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Calender" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Report" />
        </ListItemButton>
      </List>
    </div>
  );
}

export default Navigation;
