import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const AlertMessage = ({ message, setAlert }) => {
  const [open, setOpen] = useState(true);
  const [top, setTop] = useState(70);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTop(-70);
    }, 3000);

    const closeTimer = setTimeout(() => {
      setOpen(false);
      setAlert({ open: false, message: "", type: "" });
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [setAlert]);

  return (
    <Box
      sx={{
        display: "inline-block",
        position: "fixed",
        top: top,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        transition: "top 0.5s ease-in-out",
      }}
    >
      <Collapse in={open}>
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                setAlert({ open: false, message: "" });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2, display: "inline-flex" }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default AlertMessage;
