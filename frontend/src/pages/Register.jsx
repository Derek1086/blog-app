import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { URL } from "../url";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "Invalid username or pw",
    type: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmedPassword = () =>
    setShowConfirmedPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async () => {
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
    if (password !== confirmedpassword) {
      setError({
        open: true,
        message: "Passwords do not match",
        type: "confirmedpassword",
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
      navigate("/login");
    } catch (err) {
      setError({
        open: true,
        message: "Invalid Credentials",
        type: "login",
      });
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
          {error.open === true && (
            <h3 className="text-red-500 text-sm ">{error.message}</h3>
          )}
          <TextField
            onChange={(e) => setUsername(e.target.value)}
            id="standard-basic"
            label="Username"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "username" && error.open === true}
          />
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            id="standard-basic"
            label="Email"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "email" && error.open === true}
          />
          <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel
              htmlFor="standard-adornment-password"
              color="secondary"
              error={error.type === "password" && error.open === true}
            >
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              color="secondary"
              error={error.type === "password" && error.open === true}
              onChange={(e) => setPassword(e.target.value)}
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
          <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel
              htmlFor="standard-adornment-password"
              color="secondary"
              error={error.type === "confirmedpassword" && error.open === true}
            >
              Confirm Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              color="secondary"
              error={error.type === "password" && error.open === true}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              type={showConfirmedPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmedPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showConfirmedPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {/* <TextField
            onChange={(e) => setPassword(e.target.value)}
            id="standard-basic"
            label="Password"
            type="password"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "password" && error.open === true}
          /> */}
          {/* <TextField
            onChange={(e) => setConfirmedPassword(e.target.value)}
            id="standard-basic"
            label="Confirm Password"
            type="password"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "confirmedpassword" && error.open === true}
          /> */}
          <Button
            onClick={handleRegister}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
          >
            Register
          </Button>
          <div className="flex justify-center items-center space-x-3">
            <p>Already have an account?</p>
            <p className="text-gray-500 hover:text-white">
              <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
