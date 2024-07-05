import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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

const CustomModal = ({
  open,
  onclose,
  title,
  leftbuttonclick,
  leftbuttontext,
  rightbuttonclick,
  rightbuttontext,
}) => {
  return (
    <Modal open={open} onClose={onclose}>
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ wordWrap: "break-word" }}
        >
          {title}
        </Typography>
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
            onClick={leftbuttonclick}
          >
            {leftbuttontext}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "40%", padding: "10px" }}
            onClick={rightbuttonclick}
          >
            {rightbuttontext}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModal;
