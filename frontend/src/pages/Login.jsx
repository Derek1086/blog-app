import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import MainContainer from "../ui/container/MainContainer";
import Stack from "@mui/material/Stack";
import CustomTextField from "../ui/input/CustomTextField";
import Button from "@mui/material/Button";

/**
 * Login component for user authentication.
 * Renders a form for users to enter their email/username or username and password.
 * Handles login functionality and displays error messages if necessary.
 * Redirects user to home page upon successful login.
 *
 * @returns {JSX.Element} Login component
 */
const Login = () => {
  // State variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [disabled, setDisabled] = useState(true);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles showing or hiding password.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (email.trim() === "" || password.trim() === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [email, password]);

  /**
   * Prevents default mouse down event.
   * @param {Event} event - The mouse down event.
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * Handles login functionality.
   * Sends post request to server with email/username and password.
   * If successful, sets user and redirects to home page.
   * If unsuccessful, sets error message and logs error.
   */
  const handleLogin = async () => {
    // Check if email and password fields are empty
    if (email.trim() === "") {
      setError({
        open: true,
        message: "Email cannot be empty",
        type: "email",
      });
      return;
    }
    if (password.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
        type: "password",
      });
      return;
    }

    try {
      // Send post request to server
      const res = await axios.post(
        URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      // Set user and reset error state
      setUser(res.data);
      setError({
        open: false,
        message: "",
        type: "",
      });
      navigate("/");
    } catch (err) {
      // Set error message and log error
      setError({
        open: true,
        message: "Invalid credentials",
        type: "login",
      });
      console.log(err);
    }
  };

  return (
    <div className="w-full flex justify-center items-center mt-10">
      <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
        <Stack spacing={2} sx={{ width: "100%" }}>
          <HeaderText fontsize={"22px"} text="Login" textalign={"center"} />
          {error.open === true && (
            <BodyText
              text={error.message}
              variant={"body2"}
              color={"red"}
              textalign={"center"}
            />
          )}
          <CustomTextField
            label="Email or Username"
            id={"email"}
            onChange={(e) => {
              setEmail(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={email}
            error={
              error.type === "login" ||
              (error.type === "email" && error.open === true)
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
            label="Password"
            id={"password"}
            onChange={(e) => {
              setPassword(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={password}
            error={
              error.type === "login" ||
              (error.type === "password" && error.open === true)
            }
            autoFocus={false}
            password={true}
            showPassword={showPassword}
            enterFunction={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            handleClick={handleClickShowPassword}
            handleShow={handleMouseDownPassword}
            maxLength={50}
          />
          <Button
            onClick={handleLogin}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
            disabled={disabled}
          >
            Log in
          </Button>
          <MainContainer
            children={
              <>
                <BodyText text="New here?" variant={"body2"} color={"white"} />
                <Link to="/register">
                  <BodyText
                    text="Register"
                    variant={"body2"}
                    color={"text.secondary"}
                  />
                </Link>
              </>
            }
          />
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
          >
            Continue as Guest
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default Login;
