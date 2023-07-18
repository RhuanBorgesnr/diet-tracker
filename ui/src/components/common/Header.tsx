/* eslint-disable react/jsx-no-undef */
import * as React from "react";
import Box from '@mui/material/Box';

import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  ListItemIcon,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { useCallback, useState } from "react";
import { useHistory } from "react-router";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Divider } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import Avatar from "@mui/material/Avatar";
// import { getUser } from '../../utils/login';


type HeaderProps = {
  onLogout: () => void;
};

const Header = ({ onLogout }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  const user = "rhuan borges";
  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = useCallback(() => {
    onLogout();
    history.push("/login");
  }, [history, onLogout]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleToggleDrawer}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            onClick={() => history.push("/")}
            variant="h6"
            component="div"
          >
            EasyDiet
          </Typography>

          <Avatar sx={{ ml: 4 }}>{user?.charAt(0)}</Avatar>
          <Button
            variant="contained"
            onClick={handleLogout}
            className="logout-button"
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={handleToggleDrawer}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleToggleDrawer}
          onKeyDown={handleToggleDrawer}
        >
          <List>
            {[
              { text: "Inicio", icon: HomeOutlinedIcon, redirectTo: "/" },
              {
                text: "Starred",
                icon: BarChartOutlinedIcon,
                redirectTo: "/starred",
              },
              { text: "Send email", icon: MailIcon, redirectTo: "/send-email" },
              // { text: "Drafts", icon: InboxIcon, redirectTo: "/drafts" },
            ].map(({ text, icon: IconComponent, redirectTo }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => history.push(redirectTo)}>
                  <ListItemIcon>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          {/* <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon onClick={() => history.push('/seu-redirecionamento')} />

                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Box>
      </Drawer>
    </Box>
  );
};

export default Header;
