import TextField from "@mui/material/TextField";
import BodyText from "../text/BodyText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextField = ({
  label,
  id,
  onchange,
  value,
  error,
  autofocus,
  password,
  showpassword,
  enterfunction,
  handleclick,
  handleshow,
  maxLength,
}) => {
  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <BodyText
          text={label}
          variant={"body2"}
          color={"text.secondary"}
          textalign={"left"}
        />
      </div>
      {!password ? (
        <TextField
          id={id}
          label=""
          variant="outlined"
          color="secondary"
          sx={{ width: "100%" }}
          onChange={onchange}
          value={value}
          error={error}
          onKeyDown={enterfunction}
          autoFocus={autofocus}
          inputProps={{ maxLength: maxLength }}
        />
      ) : (
        <TextField
          id={id}
          label=""
          variant="outlined"
          color="secondary"
          sx={{ width: "100%" }}
          onChange={onchange}
          value={value}
          error={error}
          type={showpassword ? "text" : "password"}
          onKeyDown={enterfunction}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleclick}
                  onMouseDown={handleshow}
                  edge="end"
                >
                  {showpassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            maxLength: maxLength,
          }}
        />
      )}
    </div>
  );
};

export default CustomTextField;
