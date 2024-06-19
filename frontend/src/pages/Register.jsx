import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { URL } from "../url";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "Invalid username or pw",
    type: "",
  });
  const navigate = useNavigate();

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
    if (password.trim() === "") {
      setError({
        open: true,
        message: "Password cannot be empty",
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
      navigate("/login");
    } catch (err) {
      setError({
        open: true,
        message: "Invalid credentials",
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
          <TextField
            onChange={(e) => setPassword(e.target.value)}
            id="standard-basic"
            label="Password"
            type="password"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "password" && error.open === true}
          />
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
