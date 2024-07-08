import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import { UserContextProvider } from "./context/UserContext";
import MyBlogs from "./pages/MyPosts";
import MyFavorites from "./pages/MyFavorites";
import MyHistory from "./pages/MyHistory";
import SearchedPosts from "./pages/SearchedPosts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "",
  });

  return (
    <UserContextProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route
            exact
            path="/"
            element={<Home alert={alert} setAlert={setAlert} />}
          />
          <Route
            exact
            path="/login"
            element={<Login alert={alert} setAlert={setAlert} />}
          />
          <Route
            exact
            path="/register"
            element={<Register alert={alert} setAlert={setAlert} />}
          />
          <Route
            exact
            path="/write"
            element={<CreatePost setAlert={setAlert} />}
          />
          <Route
            exact
            path="/posts/post/:id"
            element={<PostDetails alert={alert} setAlert={setAlert} />}
          />
          <Route
            exact
            path="/edit/:id"
            element={<EditPost setAlert={setAlert} />}
          />
          <Route exact path="/myposts/:id" element={<MyBlogs />} />
          <Route exact path="/myfavorites/:id" element={<MyFavorites />} />
          <Route
            exact
            path="/myhistory/:id"
            element={<MyHistory alert={alert} setAlert={setAlert} />}
          />
          <Route
            exact
            path="/profile/:id"
            element={<Profile alert={alert} setAlert={setAlert} />}
          />
          <Route exact path="/posts/:searchquery" element={<SearchedPosts />} />
        </Routes>
      </ThemeProvider>
    </UserContextProvider>
  );
};

export default App;
