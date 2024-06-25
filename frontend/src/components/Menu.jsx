import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const Menu = () => {
  const { user } = useContext(UserContext);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(URL + "/api/auth/logout", {
        withCredentials: true,
      });
      // console.log(res)
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className=" w-[200px] z-10 flex flex-col items-start absolute top-12 right-6 md:right-32 rounded-md p-4 space-y-4">
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <List>
          {!user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/login")}>
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          )}

          {!user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/register")}>
                <ListItemText primary="Register" />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/profile/" + user._id)}>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/write")}>
                <ListItemText primary="Write" />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/myposts/" + user._id)}>
                <ListItemText primary="My Posts" />
              </ListItemButton>
            </ListItem>
          )}
          {user && (
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </div>
  );
};

export default Menu;
