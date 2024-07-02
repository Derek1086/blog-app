import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import axios from "axios";
import { URL, IF } from "../url";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
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
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      // console.log(res.data)
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(true);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }

    try {
      const res = await axios.post(
        URL + "/api/comments/create",
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      setComment("");
      await fetchPostComments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar query={""} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete "{post.title}"
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
              onClick={handleDeletePost}
              variant="contained"
              color="secondary"
              sx={{ width: "40%", padding: "10px" }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
      {loader ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold md:text-3xl">{post.title}</h1>
            {user?._id === post?.userId && (
              <div className="flex items-center justify-center space-x-2">
                <IconButton onClick={() => navigate("/edit/" + postId)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500 justify-between mt-2 md:mt-4">
            <p>@{post.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
              <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
            </div>
          </div>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories:</p>
            <div className="flex justify-center items-center space-x-2">
              {post.categories && post.categories.length > 0 ? (
                post.categories.map((c, i) => (
                  <Card sx={{ padding: "10px" }} key={i}>
                    {c}
                  </Card>
                ))
              ) : (
                <p>None</p>
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={IF + post.photo} className="w-3/4  mx-auto mt-8" alt="" />
          </div>
          {post.desc && (
            <div className="mx-auto mt-8">
              {post.desc.split("\\n").map((paragraph, index) => (
                <div key={index}>
                  <p key={index}>{paragraph}</p>
                  <br />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col mt-4">
            {comments.length !== 1 ? (
              <h3 className="mt-6 mb-4 font-semibold">
                {comments.length} Comments
              </h3>
            ) : (
              <h3 className="mt-6 mb-4 font-semibold">
                {comments.length} Comment
              </h3>
            )}
          </div>
          <>
            {user ? (
              <>
                <div className="w-full flex flex-col md:flex-row">
                  <TextField
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    id="standard-basic"
                    label="Write a comment"
                    variant="standard"
                    color="secondary"
                    style={{ width: "100%" }}
                    multiline
                    minRows={1}
                    maxRows={5}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        postComment(e);
                      }
                    }}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    onClick={postComment}
                    variant="contained"
                    color="secondary"
                    sx={{ padding: "10px" }}
                  >
                    Add Comment
                  </Button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  variant="contained"
                  color="secondary"
                  sx={{ padding: "10px" }}
                >
                  Login to comment
                </Button>
              </div>
            )}
            <div className="mt-4 mb-20">
              {comments?.map((c) => (
                <Comment key={c._id} c={c} post={post} />
              ))}
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
