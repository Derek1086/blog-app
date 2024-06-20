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

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
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

      // fetchPostComments()
      // setComment("")
      window.location.reload(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
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
                <IconButton onClick={handleDeletePost}>
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
          <p className="mx-auto mt-8">{post.desc}</p>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">
              {comments.length} Comments
            </h3>
          </div>
          <>
            {user ? (
              <>
                <div className="w-full flex flex-col md:flex-row">
                  <TextField
                    onChange={(e) => setComment(e.target.value)}
                    id="standard-basic"
                    label="Write a comment"
                    variant="standard"
                    color="secondary"
                    style={{ width: "100%" }}
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
