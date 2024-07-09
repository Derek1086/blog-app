import axios from "axios";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "../url";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";
import CustomModal from "../ui/container/CustomModal";
import CustomTextField from "../ui/input/CustomTextField";

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
      setCommentId("");
      setError({ open: false, message: "", type: "" });
      window.location.reload(true);
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

  return (
    <>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title={"Are you sure you want to delete your comment?"}
        leftButtonText="Back"
        leftButtonClick={() => setOpen(false)}
        rightButtonText="Delete"
        rightButtonClick={() => deleteComment(commentId)}
      />
      <Card sx={{ padding: "10px", marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link to={"/profile/" + c.userId}>
              <BodyText
                text={c.author}
                variant={"body2"}
                color={"text.secondary"}
              />
            </Link>
            <BodyText
              text={formatDistanceToNow(new Date(c.createdAt), {
                addSuffix: true,
              })}
              variant={"caption"}
              color={"text.secondary"}
            />
          </div>
          <div className="flex justify-center items-center space-x-4">
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
                marginTop: "10px",
              }}
            >
              {error.open === true && (
                <BodyText
                  text={error.message}
                  variant={"body2"}
                  color={"red"}
                  textalign={"center"}
                />
              )}
            </div>
            <CustomTextField
              label="Comment"
              id={"comment"}
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              error={error.open === true}
              autoFocus={true}
              password={false}
              showPassword={null}
              enterFunction={(e) => {
                if (e.key === "Enter") {
                  updateComment();
                }
              }}
              handleClick={null}
              handleShow={null}
              maxLength={200}
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
            <BodyText text={c.comment} variant={"body1"} color={"white"} />
          </div>
        )}
      </Card>
    </>
  );
};

export default Comment;
