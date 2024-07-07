import React from "react";
import TextField from "@mui/material/TextField";
import BodyText from "../text/BodyText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextField = ({
  label,
  id,
  onChange,
  value,
  error,
  autoFocus,
  password,
  showPassword,
  enterFunction,
  handleClick,
  handleMouseDown,
  maxLength,
  disabled,
  inputProps,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <BodyText
          text={label}
          variant="body2"
          color="text.secondary"
          textAlign="left"
        />
      </div>
      {!password ? (
        <TextField
          id={id}
          label=""
          variant="outlined"
          color="secondary"
          sx={{ width: "100%" }}
          onChange={onChange}
          value={value}
          error={error}
          onKeyDown={enterFunction}
          autoFocus={autoFocus}
          InputProps={inputProps || null}
          inputProps={{ maxLength: maxLength }}
          disabled={disabled}
        />
      ) : (
        <TextField
          id={id}
          label=""
          variant="outlined"
          color="secondary"
          sx={{ width: "100%" }}
          onChange={onChange}
          value={value}
          error={error}
          type={showPassword ? "text" : "password"}
          onKeyDown={enterFunction}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClick}
                  onMouseDown={handleMouseDown}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: maxLength }}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default CustomTextField;
