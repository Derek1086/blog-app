import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { styled, alpha } from "@mui/material/styles";

import classes from "./NavBar.module.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  // console.log(prompt)

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
            {path === "/" && (
              <div className={classes.search}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                  />
                </Search>
              </div>
            )}
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
                  <p className="cursor-pointer relative">
                    <MenuIcon />
                  </p>
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
              <p className="cursor-pointer relative">
                <MenuIcon />
              </p>
              {menu && <Menu />}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
