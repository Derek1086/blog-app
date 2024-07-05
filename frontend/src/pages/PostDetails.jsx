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
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";
import Stack from "@mui/material/Stack";
import CustomModal from "../ui/container/CustomModal";
import CustomTextField from "../ui/input/CustomTextField";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState(null); // Initialize as null
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setPost(res.data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
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
      console.log(err);
      setLoader(false);
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
      <CustomModal
        open={open}
        onclose={() => setOpen(false)}
        title={`Are you sure you want to delete '${post?.title}'?`}
        leftbuttontext="Back"
        leftbuttonclick={() => setOpen(false)}
        rightbuttontext="Delete"
        rightbuttonclick={handleDeletePost}
      />
      {loader || !post ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <Stack spacing={2} style={{ marginTop: "10px" }}>
          <div className="px-8 md:px-[200px]">
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

            <div className="flex items-center text-gray-500 justify-between md:mt-2">
              <BodyText
                text={post.username}
                variant={"body1"}
                color={"text.secondary"}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <BodyText
                  text={formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}
                  variant={"body2"}
                  color={"text.secondary"}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 font-semibold">
              <BodyText
                text={"Categories: "}
                variant={"body1"}
                color={"white"}
              />
              <div className="flex justify-center items-center space-x-2">
                {post.categories && post.categories.length > 0 ? (
                  post.categories.map((c, i) => (
                    <Card sx={{ padding: "10px" }} key={i}>
                      <BodyText text={c} variant={"body2"} color={"white"} />
                    </Card>
                  ))
                ) : (
                  <BodyText text={"None"} variant={"body1"} color={"white"} />
                )}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <img src={IF + post.photo} className="w-3/4  mx-auto" alt="" />
            </div>
            {post.desc && (
              <div className="mx-auto mt-4">
                {post.desc.split("\\n").map((paragraph, index) => (
                  <div key={index}>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col">
              {comments.length !== 1 ? (
                <BodyText
                  text={`${comments.length} Comments`}
                  variant={"body1"}
                  color={"white"}
                />
              ) : (
                <BodyText
                  text={`${comments.length} Comment`}
                  variant={"body1"}
                  color={"white"}
                />
              )}
            </div>
            <>
              {user ? (
                <>
                  <div className="w-full flex flex-col md:flex-row">
                    <div style={{ width: "100%" }}>
                      <CustomTextField
                        label="Write a comment"
                        id={"comment"}
                        onchange={(e) => setComment(e.target.value)}
                        value={comment}
                        error={null}
                        autofocus={false}
                        password={false}
                        showpassword={null}
                        enterfunction={(e) => {
                          if (e.key === "Enter") {
                            postComment(e);
                          }
                        }}
                        handleclick={null}
                        handleshow={null}
                      />
                    </div>
                  </div>
                  <div className="mt-2">
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
              <div className="mt-2 mb-20">
                {comments?.map((c) => (
                  <Comment key={c._id} c={c} post={post} />
                ))}
              </div>
            </>
          </div>
        </Stack>
      )}
      <div style={{ height: "400px" }} />
    </div>
  );
};

export default PostDetails;
