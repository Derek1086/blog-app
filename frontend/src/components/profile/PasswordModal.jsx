import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CustomTextField from "../../ui/input/CustomTextField";
import BodyText from "../../ui/text/BodyText";
import Stack from "@mui/material/Stack";

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

const PasswordModal = ({
  open,
  onClose,
  authenticated,
  error,
  setError,
  currentPassword,
  setCurrentPassword,
  password,
  setPassword,
  confirmedPassword,
  setConfirmedPassword,
  handlePasswordUpdate,
  handlePasswordVerify,
  resetView,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleClickShowConfirmedPassword,
  showConfirmedPassword,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      {authenticated ? (
        <Box sx={style}>
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
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
              autoFocus={true}
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
              value={confirmedPassword}
              error={error.type === "confirmedpassword" && error.open === true}
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
                password.trim() === "" || confirmedPassword.trim() === ""
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
              setCurrentPassword(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={currentPassword}
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
              disabled={currentPassword.trim() === ""}
            >
              Confirm
            </Button>
          </div>
        </Box>
      )}
    </Modal>
  );
};

export default PasswordModal;
