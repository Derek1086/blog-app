import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import { UserContextProvider } from "./context/UserContext";
import MyBlogs from "./pages/MyPosts";
import SearchedPosts from "./components/SearchedPosts";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <UserContextProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/write" element={<CreatePost />} />
          <Route exact path="/posts/post/:id" element={<PostDetails />} />
          <Route exact path="/edit/:id" element={<EditPost />} />
          <Route exact path="/myposts/:id" element={<MyBlogs />} />
          <Route exact path="/profile/:id" element={<Profile />} />
          <Route exact path="/posts/:searchquery" element={<SearchedPosts />} />
        </Routes>
      </ThemeProvider>
    </UserContextProvider>
  );
};

export default App;
