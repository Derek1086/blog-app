import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { IF, URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import classes from "./Profile.module.css";

const Profile = () => {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState({
    editing: false,
    type: "",
  });
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });

  const fetchProfile = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get(URL + "/api/users/" + user._id);
      setUsername(res.data.username);
      setEmail(res.data.email);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUserUpdate = async () => {
    if (username.trim() === "") {
      setError({
        open: true,
        message: "Username cannot be empty",
        type: "username",
      });
      return;
    }
    if (email.trim() === "") {
      setError({
        open: true,
        message: "Email cannot be empty",
        type: "email",
      });
      return;
    }

    try {
      const res = await axios.put(
        URL + "/api/users/" + user._id,
        { username, email },
        { withCredentials: true }
      );
      window.location.reload();
    } catch (err) {
      // Handle duplicate username or email error
      if (err.response && err.response.status === 400) {
        setError({
          open: true,
          message: err.response.data.message,
          type: err.response.data.message.includes("Username")
            ? "username"
            : "email",
        });
      } else {
        // Set general error message and log error
        setError({
          open: true,
          message: "Invalid Credentials",
          type: "login",
        });
        console.log(err);
      }
    }
  };

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(URL + "/api/users/" + user._id, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserPosts = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [param, user]);

  useEffect(() => {
    fetchUserPosts();
  }, [param, user]);

  return (
    <div>
      <Navbar query={""} />
      <div className={`px-8 py-5 md:px-[200px] space-y-5 ${classes.container}`}>
        <div className={`flex flex-col space-y-5 ${classes.profile}`}>
          <h1 className="text-xl font-bold mt-5">Your Profile</h1>
          {error.open === true && (
            <h3 className="text-red-500 text-sm ">{error.message}</h3>
          )}
          <div className={classes.line}>
            <TextField
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              label="Username"
              variant="standard"
              color="secondary"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserUpdate();
                }
              }}
              disabled={
                editing.editing === false || editing.type !== "username"
              }
              error={error.type === "username" && error.open === true}
            />
            {editing.editing === true && editing.type === "username" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    backgroundColor: "gray",
                    width: "50%",
                    padding: "10px",
                  }}
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "50%", padding: "10px" }}
                  onClick={handleUserUpdate}
                >
                  Update
                </Button>
              </div>
            ) : (
              <IconButton
                onClick={() =>
                  setEditing({
                    editing: true,
                    type: "username",
                  })
                }
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div className={classes.line}>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              label="Email"
              variant="standard"
              color="secondary"
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserUpdate();
                }
              }}
              disabled={editing.editing === false || editing.type !== "email"}
              error={error.type === "email" && error.open === true}
            />
            {editing.editing === true && editing.type === "email" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    backgroundColor: "gray",
                    width: "50%",
                    padding: "10px",
                  }}
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "50%", padding: "10px" }}
                  onClick={handleUserUpdate}
                >
                  Update
                </Button>
              </div>
            ) : (
              <IconButton
                onClick={() =>
                  setEditing({
                    editing: true,
                    type: "email",
                  })
                }
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div className={classes.line}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ padding: "10px" }}
            >
              Update Password
            </Button>
          </div>
        </div>
        <div className={classes.posts}>
          <h1 className="text-xl font-bold mb-5">Your Posts</h1>
          {posts.length === 0 ? (
            <p>You haven't posted anything</p>
          ) : (
            posts.map((p) => (
              <Link to={`/posts/post/${p._id}`} key={p._id}>
                <ProfilePosts key={p._id} post={p} />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
