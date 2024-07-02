import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { IF, URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useParams, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import classes from "./Profile.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const param = useParams().id;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userpassword, setUserPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState({
    editing: false,
    type: "",
  });
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });

  // State variables for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
      setOpen(false);
      setError({ open: false, message: "", type: "" });
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

  const handlePasswordUpdate = async () => {
    if (password.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "password",
      });
      return;
    }
    if (confirmedpassword.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "confirmedpassword",
      });
      return;
    }

    // Validate password match
    if (password !== confirmedpassword) {
      setError({
        open: true,
        message: "Passwords do not match",
        type: "confirmedpassword",
      });
      return;
    }

    try {
      const res = await axios.put(
        URL + "/api/users/password/" + user._id,
        { password },
        { withCredentials: true }
      );
      setOpen(false);
      setError({ open: false, message: "", type: "" });
      setAuthenticated(false);
      window.location.reload();
    } catch (err) {
      // Set general error message and log error
      setError({
        open: true,
        message: "Invalid Credentials",
        type: "login",
      });
      console.log(err);
    }
  };

  const handlePasswordVerify = async () => {
    if (userpassword.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "userpassword",
      });
      return;
    }

    try {
      const res = await axios.put(
        URL + "/api/users/password/verify/" + user._id,
        { userpassword },
        { withCredentials: true }
      );
      console.log("Password verified successfully");
      setAuthenticated(true);
    } catch (err) {
      console.error("Password verification failed:", err);
      setError({
        open: true,
        message: "Incorrect Password",
        type: "userpassword",
      });
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {authenticated ? (
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Change Password
            </Typography>
            {error.open === true && (
              <h3 className="text-red-500 text-sm mt-2">{error.message}</h3>
            )}
            <FormControl
              sx={{ width: "100%", marginTop: "10px" }}
              variant="standard"
            >
              <InputLabel
                htmlFor="standard-adornment-password"
                color="secondary"
                error={error.type === "password" && error.open === true}
              >
                New Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                color="secondary"
                error={error.type === "password" && error.open === true}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl
              sx={{ width: "100%", marginTop: "10px" }}
              variant="standard"
            >
              <InputLabel
                htmlFor="standard-adornment-confirmed-password"
                color="secondary"
                error={
                  error.type === "confirmedpassword" && error.open === true
                }
              >
                Confirm Password
              </InputLabel>
              <Input
                id="standard-adornment-confirmed-password"
                color="secondary"
                error={error.type === "password" && error.open === true}
                onChange={(e) => setConfirmedPassword(e.target.value)}
                value={confirmedpassword}
                type={showConfirmedPassword ? "text" : "password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordUpdate();
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmedPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmedPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "gray",
                  width: "40%",
                  padding: "10px",
                }}
                onClick={() => setOpen(false)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "40%", padding: "10px" }}
                onClick={handlePasswordUpdate}
              >
                Update
              </Button>
            </div>
          </Box>
        ) : (
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirm Current Password
            </Typography>
            {error.open === true && (
              <h3 className="text-red-500 text-sm mt-2">{error.message}</h3>
            )}
            <FormControl
              sx={{ width: "100%", marginTop: "10px" }}
              variant="standard"
            >
              <InputLabel
                htmlFor="standard-adornment-current-password"
                color="secondary"
                error={error.type === "userpassword" && error.open === true}
              >
                Current Password
              </InputLabel>
              <Input
                id="standard-adornment-current-password"
                color="secondary"
                error={error.type === "userpassword" && error.open === true}
                onChange={(e) => setUserPassword(e.target.value)}
                value={userpassword}
                type={showPassword ? "text" : "password"}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePasswordVerify();
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "gray",
                  width: "40%",
                  padding: "10px",
                }}
                onClick={() => setOpen(false)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "40%", padding: "10px" }}
                onClick={handlePasswordVerify}
              >
                Confirm
              </Button>
            </div>
          </Box>
        )}
      </Modal>
      <div className={`px-8 py-5 md:px-[200px] space-y-5 ${classes.container}`}>
        <div className={`flex flex-col space-y-5 ${classes.profile}`}>
          <h1 className="text-xl font-bold mt-5">Your Profile</h1>
          {error.open === true && !error.type.includes("password") && (
            <h3 className="text-red-500 text-sm">{error.message}</h3>
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
              onClick={() => setOpen(true)}
            >
              Change Password
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
