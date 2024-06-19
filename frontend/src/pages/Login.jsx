import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
        message: "Invalid login",
        type: "login",
      });
      console.log(err);
    }
  };
  return (
    <>
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%]">
          <h1 className="text-xl font-bold text-left">
            Log in to your account
          </h1>
          {error.open === true && (
            <h3 className="text-red-500 text-sm ">{error.message}</h3>
          )}
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
            type="password"
            label="Password"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "password" && error.open === true}
          />
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
