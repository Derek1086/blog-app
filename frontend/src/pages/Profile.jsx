import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import Stack from "@mui/material/Stack";
import CustomTextField from "../ui/input/CustomTextField";
import CustomPagination from "../ui/container/CustomPagination";
import PostRenderer from "../components/PostRenderer";

import classes from "./Profile.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  // State variables
  const param = useParams().id; // USER ID
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedPassword] = useState("");
  const { user, setUser } = useContext(UserContext);
  const [visitor, setVisitor] = useState(true);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const [page, setPage] = useState(1);
  const postsPerPage = 4;
  const [authenticated, setAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
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

  const handleChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  /**
   * Handles showing or hiding password.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword((show) => !show);

  /**
   * Prevents default behavior of mouse down event.
   * @param {Event} event - The mouse down event.
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Fetches user profile data from the server.
   * Sets username and email if successful.
   * Logs error if request fails.
   */
  const fetchProfile = async () => {
    if (!user || !user._id) return;
    try {
      if (param !== user?._id) {
        setVisitor(true);
        const res = await axios.get(URL + "/api/users/" + param);
        setUsername(res.data.username);
        setEmail(res.data.email);
      } else {
        setVisitor(false);
        const res = await axios.get(URL + "/api/users/" + user._id);
        setUsername(res.data.username);
        setEmail(res.data.email);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handles update of user profile.
   * Sends PUT request to server with updated username and email.
   * Reloads page if successful.
   * Sets error message and logs error if request fails.
   */
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
    if (!email.includes("@")) {
      setError({
        open: true,
        message: "Invalid email",
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

  /**
   * Handles update of user password.
   * Sends PUT request to server with updated password.
   * Reloads page if successful.
   * Sets error message and logs error if request fails.
   */
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

  /**
   * Verifies user password.
   * Sends PUT request to server to verify user password.
   * Sets authenticated state to true if successful.
   * Sets error message and logs error if request fails.
   */
  const handlePasswordVerify = async () => {
    if (userPassword.trim() === "") {
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
        { userPassword },
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

  /**
   * Fetches user posts from the server.
   * Sets posts state with fetched data.
   * Logs error if request fails.
   */
  const fetchUserPosts = async () => {
    if (!user || !user._id) return;
    try {
      if (visitor) {
        const res = await axios.get(URL + "/api/posts/user/" + param);
        setPosts(res.data.reverse());
        setLoadingPosts(false);
      } else {
        const res = await axios.get(URL + "/api/posts/user/" + user._id);
        setPosts(res.data.reverse());
        setLoadingPosts(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Resets all state variables related to password change.
   */
  const resetView = () => {
    setPassword("");
    setConfirmedPassword("");
    setUserPassword("");
    setAuthenticated(false);
    setOpen(false);
    setError({ open: false, message: "", type: "" });
    setShowPassword(false);
    setShowConfirmedPassword(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [param, user]);

  useEffect(() => {
    fetchUserPosts();
  }, [param, user]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <div>
      <Navbar query={""} />
      {visitor ? (
        <div className={`px-8 py-5 md:px-[200px] ${classes.container}`}>
          <div className={classes.profile}>
            <Stack spacing={2}>
              <HeaderText
                fontsize={"20px"}
                text={`${username}'s Profile`}
                textalign={"left"}
              />
            </Stack>
            <div className="mb-5" />
          </div>
          <div className={classes.posts}>
            <Stack spacing={2}>
              <HeaderText
                fontsize={"20px"}
                text={`${username}'s Posts`}
                textalign={"left"}
              />
              <div>
                {loadingPosts ? (
                  <ProfileLoader />
                ) : posts.length === 0 ? (
                  <h3 className="text-center font-bold mt-16">
                    No posts available
                  </h3>
                ) : (
                  currentPosts.map((post) => (
                    <Link to={`/posts/post/${post._id}`} key={post._id}>
                      <ProfilePosts key={post._id} post={post} />
                    </Link>
                  ))
                )}
              </div>
              {/* Pagination */}
              <CustomPagination
                posts={posts}
                postsPerPage={postsPerPage}
                page={page}
                handleChange={handleChange}
              />
            </Stack>
          </div>
        </div>
      ) : (
        <>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            {authenticated ? (
              <Box sx={style}>
                <Stack spacing={2} sx={{ width: "100%" }}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Change Password
                  </Typography>
                  {error.open === true && (
                    <BodyText
                      text={error.message}
                      variant={"body2"}
                      color={"red"}
                      textalign={"center"}
                    />
                  )}
                  <CustomTextField
                    label="New Password"
                    id={"new-password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError({ open: false, message: "", type: "" });
                    }}
                    value={password}
                    error={error.type === "password" && error.open === true}
                    autoFocus={false}
                    password={true}
                    showPassword={showPassword}
                    enterFunction={null}
                    handleClick={handleClickShowPassword}
                    handleShow={handleMouseDownPassword}
                    maxLength={50}
                  />
                  <CustomTextField
                    label="Confirm Password"
                    id={"confirm-password"}
                    onChange={(e) => {
                      setConfirmedPassword(e.target.value);
                      setError({ open: false, message: "", type: "" });
                    }}
                    value={confirmedpassword}
                    error={
                      error.type === "confirmedpassword" && error.open === true
                    }
                    autoFocus={false}
                    password={true}
                    showPassword={showConfirmedPassword}
                    enterFunction={(e) => {
                      if (e.key === "Enter") {
                        handlePasswordUpdate();
                      }
                    }}
                    handleClick={handleClickShowConfirmedPassword}
                    handleShow={handleMouseDownPassword}
                    maxLength={50}
                  />
                </Stack>
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
                    onClick={() => resetView()}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: "40%", padding: "10px" }}
                    onClick={handlePasswordUpdate}
                    disabled={
                      password.trim() === "" || confirmedpassword.trim() === ""
                    }
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
                  <BodyText
                    text={error.message}
                    variant={"body2"}
                    color={"red"}
                    textalign={"center"}
                  />
                )}
                <CustomTextField
                  label="Current Password"
                  id={"current-password"}
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                    setError({ open: false, message: "", type: "" });
                  }}
                  value={userPassword}
                  error={error.type === "userpassword" && error.open === true}
                  autoFocus={false}
                  password={true}
                  showPassword={showPassword}
                  enterFunction={(e) => {
                    if (e.key === "Enter") {
                      handlePasswordVerify();
                    }
                  }}
                  handleClick={handleClickShowPassword}
                  handleShow={handleMouseDownPassword}
                  maxLength={50}
                />
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
                    onClick={() => resetView()}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ width: "40%", padding: "10px" }}
                    onClick={handlePasswordVerify}
                    disabled={userPassword.trim() === ""}
                  >
                    Confirm
                  </Button>
                </div>
              </Box>
            )}
          </Modal>
          <div className={`px-8 py-5 md:px-[200px] ${classes.container}`}>
            <div className={classes.profile}>
              <Stack spacing={2}>
                <HeaderText
                  fontsize={"20px"}
                  text="Your Profile"
                  textalign={"left"}
                />
                {error.open === true && !error.type.includes("password") && (
                  <BodyText
                    text={error.message}
                    variant={"body2"}
                    color={"red"}
                    textalign={"center"}
                  />
                )}
                <div className={classes.line}>
                  <CustomTextField
                    label="Username"
                    id={"username"}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError({ open: false, message: "", type: "" });
                    }}
                    value={username}
                    error={error.type === "username" && error.open === true}
                    autoFocus={false}
                    password={false}
                    showPassword={null}
                    enterFunction={(e) => {
                      if (e.key === "Enter") {
                        handleUserUpdate();
                      }
                    }}
                    handleClick={null}
                    handleShow={null}
                    maxLength={50}
                    disabled={
                      editing.editing === false || editing.type !== "username"
                    }
                  />
                  {editing.editing === true && editing.type === "username" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "25px",
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
                      sx={{ marginTop: "25px" }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </div>
                <div className={classes.line}>
                  <CustomTextField
                    label="Email"
                    id={"email"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError({ open: false, message: "", type: "" });
                    }}
                    value={email}
                    error={error.type === "email" && error.open === true}
                    autoFocus={false}
                    password={false}
                    showPassword={null}
                    enterFunction={(e) => {
                      if (e.key === "Enter") {
                        handleUserUpdate();
                      }
                    }}
                    handleClick={null}
                    handleShow={null}
                    maxLength={50}
                    disabled={
                      editing.editing === false || editing.type !== "email"
                    }
                  />
                  {editing.editing === true && editing.type === "email" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "25px",
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
                      sx={{ marginTop: "25px" }}
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
              </Stack>
              <div className="mb-5" />
            </div>
          </div>
          <PostRenderer
            route={"/api/posts/user/" + user._id}
            headerText={"Your Posts"}
            altText={"You don't have any posts"}
            sortable={false}
            searchable={false}
            searchquery={""}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
