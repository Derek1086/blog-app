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
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;

  // console.log(prompt)

  const filterPrompt = (e) => {
    let prompt = e.target.value;
    console.log(prompt);
    if (prompt.trim() === "") {
      return;
    }
    //navigate(`/search?q=${prompt}`);
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
            {
              <div className={classes.search}>
                <div style={{ width: "100%" }}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                      onChange={filterPrompt}
                    />
                  </Search>
                </div>
                <IconButton>
                  <FilterAltIcon />
                </IconButton>
              </div>
            }
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
