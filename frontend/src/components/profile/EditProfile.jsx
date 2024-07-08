import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../url";
import { UserContext } from "../../context/UserContext";
import Stack from "@mui/material/Stack";
import CustomTextField from "../../ui/input/CustomTextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import InputAdornment from "@mui/material/InputAdornment";
import PasswordModal from "./PasswordModal";

const EditProfile = ({ setAlert, setProfileEditing }) => {
  // State variables
  const { user } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [editing, setEditing] = useState({
    editing: false,
    type: "",
  });

  /**
   * Handles showing or hiding password.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword((show) => !show);

  /**
   * Prevents default mouse down event.
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
  const fetchUserProfile = async () => {
    if (!user || !user._id) return;
    try {
      const res = await axios.get(URL + "/api/users/" + user._id);
      setUsername(res.data.username);
      setEmail(res.data.email);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

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
      setAlert({
        open: true,
        message: "Profile updated successfully",
        type: "profile",
      });
      setProfileEditing(false);
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
    if (confirmedPassword.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "confirmedpassword",
      });
      return;
    }

    // Validate password match
    if (password !== confirmedPassword) {
      setError({
        open: true,
        message: "Passwords do not match",
        type: "confirmedpassword",
      });
      return;
    }
    if (password === currentPassword) {
      setError({
        open: true,
        message: "New password cannot be same as old password",
        type: "password",
      });
      return;
    }

    try {
      const res = await axios.put(
        URL + "/api/users/password/" + user._id,
        { password },
        { withCredentials: true }
      );
      resetView();
      setAlert({
        open: true,
        message: "Password updated successfully",
        type: "profile",
      });
      setProfileEditing(false);
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
    if (currentPassword.trim() === "") {
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
        { currentPassword },
        { withCredentials: true }
      );
      console.log("Password verified successfully");
      setAuthenticated(true);
    } catch (err) {
      console.error("Password verification failed:", err);
      setAuthenticated(false);
      setError({
        open: true,
        message: "Incorrect Password",
        type: "userpassword",
      });
    }
  };

  /**
   * Resets all state variables related to password change.
   */
  const resetView = () => {
    setCurrentPassword("");
    setPassword("");
    setConfirmedPassword("");
    setAuthenticated(false);
    setOpen(false);
    setError({ open: false, message: "", type: "" });
    setShowPassword(false);
    setShowConfirmedPassword(false);
  };

  return (
    <>
      <PasswordModal
        open={open}
        onClose={() => setOpen(false)}
        authenticated={authenticated}
        error={error}
        setError={setError}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        password={password}
        setPassword={setPassword}
        confirmedPassword={confirmedPassword}
        setConfirmedPassword={setConfirmedPassword}
        handlePasswordUpdate={handlePasswordUpdate}
        handlePasswordVerify={handlePasswordVerify}
        resetView={resetView}
        showPassword={showPassword}
        handleClickShowPassword={handleClickShowPassword}
        handleMouseDownPassword={handleMouseDownPassword}
        handleClickShowConfirmedPassword={handleClickShowConfirmedPassword}
        showConfirmedPassword={showConfirmedPassword}
      />
      <Stack spacing={2}>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
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
            inputProps={{
              endAdornment: (
                <>
                  {editing.editing === false && editing.type !== "username" && (
                    <InputAdornment position="end">
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
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            disabled={editing.editing === false || editing.type !== "username"}
          />
          {editing.editing === true && editing.type === "username" && (
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
                }}
                onClick={() => setEditing({ editing: false })}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "50%" }}
                onClick={handleUserUpdate}
              >
                Update
              </Button>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
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
            inputProps={{
              endAdornment: (
                <>
                  {editing.editing === false && editing.type !== "email" && (
                    <InputAdornment position="end">
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
                    </InputAdornment>
                  )}
                </>
              ),
            }}
            disabled={editing.editing === false || editing.type !== "email"}
          />
          {editing.editing === true && editing.type === "email" && (
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
                }}
                onClick={() => setEditing({ editing: false })}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "50%" }}
                onClick={handleUserUpdate}
              >
                Update
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="contained"
          color="secondary"
          sx={{ padding: "10px" }}
          onClick={() => setOpen(true)}
        >
          Change Password
        </Button>
      </Stack>
    </>
  );
};

export default EditProfile;
