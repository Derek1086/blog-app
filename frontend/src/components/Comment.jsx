import axios from "axios";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "../url";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

import classes from "./Comment.module.css";

const Comment = ({ c, post }) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [commentId, setCommentId] = useState("");
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });

  const updateComment = async () => {
    if (comment === "") {
      setError({
        open: true,
        message: "Comment cannot be empty",
        type: "error",
      });
      return;
    }
    try {
      console.log(comment);
      const res = await axios.put(
        URL + `/api/comments/${commentId}`,
        {
          comment: comment,
        },
        { withCredentials: true }
      );
      setEditing(false);
      window.location.reload(true);
      setCommentId("");
      setError({ open: false, message: "", type: "" });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (id) => {
    setEditing(false);
    try {
      await axios.delete(URL + "/api/comments/" + id, {
        withCredentials: true,
      });
      window.location.reload(true);
      setCommentId("");
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(post.userId)
  // console.log(user._id)
  // console.log(post)
  // console.log(user)
  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete your comment?
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
              onClick={() => setOpen(false)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "40%", padding: "10px" }}
              onClick={() => deleteComment(commentId)}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
      <Card sx={{ padding: "10px", marginTop: "10px" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-500">@{c.author}</h3>
          <div className="flex justify-center items-center space-x-4">
            <div
              className={`flex justify-center items-center space-x-1  ${classes.date}`}
            >
              <p className="text-gray-500">
                {new Date(c.updatedAt).toString().slice(0, 15)}
              </p>
              <p className="text-gray-500">
                {new Date(c.updatedAt).toString().slice(16, 24)}
              </p>
            </div>
            {user?._id === c?.userId && !editing && (
              <div className="flex items-center justify-center space-x-2">
                <IconButton
                  onClick={() => {
                    setEditing(!editing);
                    setComment(c.comment);
                    setCommentId(c._id);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setOpen(true);
                    setCommentId(c._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
          </div>
        </div>
        {editing ? (
          <Box sx={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              {error.open === true && (
                <h3 className="text-red-500 text-sm text-center">
                  {error.message}
                </h3>
              )}
            </div>
            <TextField
              onChange={(e) => setComment(e.target.value)}
              id="standard-basic"
              label="Comment"
              variant="standard"
              color="secondary"
              style={{ width: "100%" }}
              value={comment}
              error={error.open === true}
              multiline
              minRows={1}
              maxRows={5}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateComment();
                }
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
                gap: "10px",
              }}
            >
              <Button
                onClick={() => setEditing(false)}
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: "gray",
                  padding: "10px",
                  width: "100px",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateComment()}
                variant="contained"
                color="secondary"
                sx={{ padding: "10px", width: "100px" }}
              >
                Done
              </Button>
            </Box>
          </Box>
        ) : (
          <div style={{ wordWrap: "break-word" }}>
            <span>{c.comment}</span>
          </div>
        )}
      </Card>
    </>
  );
};

export default Comment;
