import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import MainContainer from "../ui/container/MainContainer";
import Stack from "@mui/material/Stack";
import CustomTextField from "../ui/input/CustomTextField";
import Button from "@mui/material/Button";

/**
 * Register component for user registration.
 * Handles user input for username, email and password
 * and sends post request to server for registration.
 * If registration is successful, user is redirected to login page.
 * If registration fails, error message is displayed.
 */
const Register = ({ alert, setAlert }) => {
  // State variables for user input
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedPassword] = useState("");
  // State variable for error message
  const [error, setError] = useState({
    open: false,
    message: "Invalid username or pw",
    type: "",
  });
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  // State variables for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      username.trim() === "" ||
      confirmedpassword.trim() === ""
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [email, password, username, confirmedpassword]);

  /**
   * Handles registration functionality.
   * Validates user input and sends post request to server for registration.
   * If registration is successful, user is redirected to login page.
   * If registration fails, error message is displayed.
   */
  const handleRegister = async () => {
    // Validate username input
    if (username.trim() === "") {
      setError({
        open: true,
        message: "Username cannot be empty",
        type: "username",
      });
      return;
    }

    // Validate email input
    if (email.trim() === "") {
      setError({
        open: true,
        message: "Email cannot be empty",
        type: "email",
      });
      return;
    }

    // Validate email format
    if (!email.includes("@")) {
      setError({
        open: true,
        message: "Invalid email",
        type: "email",
      });
      return;
    }

    // Validate password input
    if (password.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "password",
      });
      return;
    }

    // Validate confirmed password input
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
        type: "password",
      });
      return;
    }

    try {
      const res = await axios.post(URL + "/api/auth/register", {
        username,
        email,
        password,
      });

      setUsername(res.data.username);
      setEmail(res.data.email);
      setPassword(res.data.password);

      setError({
        open: false,
        message: "",
        type: "",
      });
      setAlert({
        open: true,
        message: "Account created successfully",
        type: "register",
      });
      navigate("/login");
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
          message: "Invalid credentials",
          type: "register",
        });
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <HeaderText
            fontsize={"22px"}
            text="Create Account"
            textalign={"center"}
          />
          {error.open === true && (
            <BodyText
              text={error.message}
              variant={"body2"}
              color={"red"}
              textalign={"center"}
            />
          )}
          <CustomTextField
            label="Username"
            id={"username"}
            onChange={(e) => {
              setUsername(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={username}
            error={
              error.type === "register" ||
              (error.type === "username" && error.open === true)
            }
            autoFocus={true}
            password={false}
            showPassword={null}
            enterFunction={null}
            handleClick={null}
            handleShow={null}
            maxLength={50}
          />
          <CustomTextField
            label="Email"
            id={"email"}
            onChange={(e) => {
              setEmail(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={email}
            error={
              error.type === "register" ||
              (error.type === "email" && error.open === true)
            }
            autoFocus={false}
            password={false}
            showPassword={null}
            enterFunction={null}
            handleClick={null}
            handleShow={null}
            maxLength={50}
          />
          <CustomTextField
            label="Password"
            id={"password"}
            onChange={(e) => {
              setPassword(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={password}
            error={
              error.type === "register" ||
              error.type === "password" ||
              (error.type === "confirmedpassword" && error.open === true)
            }
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
              error.type === "register" ||
              (error.type === "password" && error.open === true)
            }
            autoFocus={false}
            password={true}
            showPassword={showConfirmedPassword}
            enterFunction={(e) => {
              if (e.key === "Enter") {
                handleRegister();
              }
            }}
            handleClick={handleClickShowConfirmedPassword}
            handleShow={handleMouseDownPassword}
            maxLength={50}
          />
          <Button
            onClick={handleRegister}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
            disabled={disabled}
          >
            Register
          </Button>
          <MainContainer justifyContent={"center"}>
            <BodyText
              text="Already have an account?"
              variant={"body2"}
              color={"white"}
            />
            <Link to="/login">
              <BodyText
                text="Login"
                variant={"body2"}
                color={"text.secondary"}
              />
            </Link>
          </MainContainer>
        </Stack>
      </div>
    </div>
  );
};

export default Register;
