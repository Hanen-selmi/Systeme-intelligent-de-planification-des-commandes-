import React, { useState, useEffect, useRef, Suspense, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';

// Material UI
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';


// Project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// Icons
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { logout } from '../../../../../store/Slice/authSlice';
import ImageAdmin from '../../../../../../../public/assets/admin/avatar-admin.jpg'
const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();


  const [notificationCount, setNotificationCount] = useState(2); // Example notification count
  const anchorRef = useRef(null);

  // Load user data (avatar, first name, last name) from local storage or API
  
    

  const handleNavigation = (path) => {
    startTransition(() => {
      navigate(path);
    });
  };

  const handleLogout = () => {
    startTransition(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      navigate('/auth/login');
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    startTransition(() => {
      setOpen((prevOpen) => !prevOpen);
    });
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '0px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.secondary,
          backgroundColor: theme.palette.secondary.main,
          
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.secondary.main,
            background: theme.palette.primary.light,
            color: theme.palette.secondary.main,
            '& svg': {
              stroke: theme.palette.secondary.main,
            },
          },
          '& .MuiChip-label': {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={ImageAdmin}
            sx={{
            
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.light} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                <Typography variant="subtitle1" sx={{ px: 2, pt: 2 }}>
                    Good Morning  <br/>
                    {'Espace :'}<br/>
                    {"utilisateur"}
                  </Typography>
                  
                  <List>
                    <ListItemButton onClick={() => handleNavigation('/Account')}>
                      <ListItemIcon>
                        <IconSettings stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                    </ListItemButton>

                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <IconLogout stroke={1.5} size="1.3rem" />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Suspense>
  );
};

export default ProfileSection;
