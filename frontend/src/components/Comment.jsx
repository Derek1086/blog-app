import axios from "axios";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { URL } from "../url";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Card from "@mui/material/Card";

import classes from "./Comment.module.css";

const Comment = ({ c, post }) => {
  const { user } = useContext(UserContext);
  const deleteComment = async (id) => {
    try {
      await axios.delete(URL + "/api/comments/" + id, {
        withCredentials: true,
      });
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(post.userId)
  // console.log(user._id)
  // console.log(post)
  // console.log(user)
  return (
    <Card sx={{ padding: "10px", marginTop: "10px" }}>
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
        <div className="flex justify-center items-center space-x-4">
          <div
            className={`flex justify-center items-center space-x-4 ${classes.date}`}
          >
            <p>{new Date(c.updatedAt).toString().slice(0, 15)}</p>
            <p>{new Date(c.updatedAt).toString().slice(16, 24)}</p>
          </div>
          {user?._id === c?.userId ? (
            <div className="flex items-center justify-center space-x-2">
              <IconButton onClick={() => deleteComment(c._id)}>
                <DeleteIcon />
              </IconButton>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <p className="mt-2">{c.comment}</p>
    </Card>
  );
};

export default Comment;
