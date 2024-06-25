import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import classes from "./NavBar.module.css";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      navigate(`/posts/${searchQuery}`);
    }
  };

  const showMenu = () => {
    setMenu(!menu);
  };

  const { user } = useContext(UserContext);

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.container}>
            <h1
              className={`text-lg md:text-xl font-extrabold ${classes.title}`}
            >
              <Link to="/">Blog</Link>
            </h1>
            <div className={classes.search}>
              <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                <Paper
                  component="form"
                  sx={{
                    p: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    width: 400,
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearchButtonClick();
                  }}
                >
                  <IconButton
                    sx={{ p: "10px" }}
                    aria-label="home"
                    onClick={() => {
                      navigate("/");
                      setSearchQuery("");
                    }}
                  >
                    <HomeIcon />
                  </IconButton>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleSearchInputChange}
                    value={searchQuery}
                  />
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={handleSearchButtonClick}
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper>
              </div>
            </div>
            <div className={classes.actions}>
              {user ? (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate("/write")}
                >
                  Write
                </Button>
              ) : (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              )}
              {user ? (
                <div onClick={showMenu}>
                  <IconButton>
                    <MenuIcon />
                  </IconButton>
                  {menu && <Menu />}
                </div>
              ) : (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              )}
            </div>
            <div onClick={showMenu} className="md:hidden text-lg">
              <IconButton>
                <MenuIcon />
              </IconButton>
              {menu && <Menu />}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
