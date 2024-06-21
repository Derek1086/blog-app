import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
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
      const res = await axios.post(
        URL + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
      setError({
        open: false,
        message: "",
        type: "",
      });
      navigate("/");
    } catch (err) {
      setError({
        open: true,
        message: "Invalid email/username or password",
        type: "login",
      });
      console.log(err);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">Log in</h1>
          {error.open === true && (
            <h3 className="text-red-500 text-sm ">{error.message}</h3>
          )}
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            id="standard-basic"
            label="Email or Username"
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
          <Button
            onClick={handleLogin}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
          >
            Log in
          </Button>
          <div className="flex justify-center items-center space-x-3">
            <p>New here?</p>
            <p className="text-gray-500 hover:text-white">
              <Link to="/register">Register</Link>
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="contained"
            color="secondary"
            style={{ width: "100%", padding: "10px" }}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
