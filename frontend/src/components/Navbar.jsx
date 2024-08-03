import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import { URL } from "../url";
import { useContext, useState, useEffect } from "react";
import Menu from "./Menu";
import { UserContext } from "../context/UserContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";

import classes from "./NavBar.module.css";

const Navbar = ({ query }) => {
  const { user } = useContext(UserContext);
  const [menu, setMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  /**
   * Fetches user search history from the server.
   * Sets search history if successful.
   * Logs error if request fails.
   */
  const fetchUserSearchHistory = async () => {
    try {
      const res = await axios.get(
        URL + "/api/users/" + user._id + "/searchhistory"
      );
      const reversedData = res.data.slice().reverse();
      setSearchHistory(reversedData);
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserSearchHistory();
    }
  }, [user]);

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handles the search button click.
   * Sends a PUT request to update user's search history and navigates to search results.
   */
  const handleSearchButtonClick = async () => {
    if (searchQuery.trim() !== "") {
      const res = await axios.put(
        URL + "/api/users/" + user._id + "/searchhistory",
        { searchQuery }
      );
      navigate(`/posts/${searchQuery}`);
    }
  };

  /**
   * Toggles visibility of the menu.
   */
  const showMenu = () => {
    setMenu(!menu);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <div className={classes.container}>
            <div className={classes.logo}>
              <h1
                className={`text-lg md:text-xl font-extrabold ${classes.title}`}
              >
                <Link to="/">Blog</Link>
              </h1>
            </div>
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
                  <Autocomplete
                    freeSolo
                    sx={{ ml: 1, flex: 1 }}
                    options={searchHistory
                      .slice(0, 6)
                      .map((history) => history)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        InputProps={{
                          ...params.InputProps,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "transparent",
                            },
                          },
                          "& .MuiInputBase-root": {
                            "&:before": {
                              borderBottom: "none",
                            },
                            "&:after": {
                              borderBottom: "none",
                            },
                          },
                        }}
                      />
                    )}
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
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate("/write")}
                >
                  Write
                </Button>
              ) : (
                <Button
                  variant="contained"
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
                  variant="contained"
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
