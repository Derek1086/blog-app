import { useNavigate, useParams, Link } from "react-router-dom";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import axios from "axios";
import { URL, IF } from "../url";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import DetailsLoader from "../ui/loaders/DetailsLoader";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";
import Stack from "@mui/material/Stack";
import CustomModal from "../ui/container/CustomModal";
import CustomTextField from "../ui/input/CustomTextField";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Divider from "@mui/material/Divider";
import PostContainer from "../ui/container/PostContainer";

/**
 * Component for displaying detailed information of a single post.
 * Allows viewing, editing, deleting, and commenting on the post.
 */
const PostDetails = () => {
  // State Variables
  const postId = useParams().id;
  const [post, setPost] = useState(null);
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Fetches the post details from the server based on postId.
   * Sets the fetched post data to state.
   * Logs error if request fails.
   */
  const fetchPost = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      setPost(res.data);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  /**
   * Deletes the post from the server based on postId.
   * Navigates to the home page upon successful deletion.
   * Logs error if request fails.
   */
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

  /**
   * Fetches comments associated with the post from the server.
   * Sets the fetched comments to state.
   * Logs error if request fails.
   */
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

  /**
   * Posts a new comment to the post on the server.
   * Resets the comment input field upon successful posting.
   * Fetches updated comments after posting.
   * Logs error if request fails.
   * @param {Object} e - The event object from the form submission.
   */
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

  /**
   * Handles toggling the favorite status of the post.
   * Adds or removes the post from user's favorites.
   */
  const handleFavoriteClick = async () => {
    try {
      const res = await axios.post(
        URL + "/api/posts/" + postId + "/favorite",
        {},
        { withCredentials: true }
      );
      setPost(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Formats the view count number to a human-readable string.
   * Displays counts in k (thousands) and M (millions) format.
   * @param {number} count - The view count number to format.
   * @returns {string} - The formatted view count string.
   */
  const formatViewCount = (count) => {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "k";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  };

  return (
    <div>
      <Navbar query={""} />
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Are you sure you want to delete '${post?.title}'?`}
        leftButtonText="Back"
        leftButtonClick={() => setOpen(false)}
        rightButtonText="Delete"
        rightButtonClick={handleDeletePost}
      />
      {loader || !post ? (
        <PostContainer>
          <DetailsLoader />
        </PostContainer>
      ) : (
        <PostContainer>
          <Stack spacing={2} style={{ marginTop: "10px" }}>
            <div className="flex justify-between items-center">
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  wordWrap: "break-word",
                }}
              >
                {post.title}
              </p>
              <div className="flex items-center justify-center space-x-2">
                {user && (
                  <IconButton onClick={handleFavoriteClick}>
                    {post.favoritedBy && post.favoritedBy.includes(user._id) ? (
                      <FavoriteIcon color="secondary" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                )}
                {user?._id === post?.userId && (
                  <>
                    <IconButton onClick={() => navigate("/edit/" + postId)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpen(true)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </div>
            </div>
            <div className="flex">
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to={"/profile/" + post.userId}>
                  <BodyText
                    text={post.username}
                    variant={"body1"}
                    color={"text.secondary"}
                  />
                </Link>
                <Divider sx={{ height: 20 }} orientation="vertical" />
                {post.viewCount !== 1 ? (
                  <BodyText
                    text={formatViewCount(post.viewCount) + " views"}
                    variant={"body1"}
                    color={"text.secondary"}
                  />
                ) : (
                  <BodyText
                    text={post.viewCount + " view"}
                    variant={"body1"}
                    color={"text.secondary"}
                  />
                )}
                <Divider sx={{ height: 20 }} orientation="vertical" />
                <BodyText
                  text={formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                  variant={"body1"}
                  color={"text.secondary"}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 font-semibold mt-2">
              <BodyText
                text={"Categories: "}
                variant={"body1"}
                color={"white"}
              />
              <div className="flex space-x-2 flex-wrap">
                {post.categories && post.categories.length > 0 ? (
                  post.categories.map((c, i) => (
                    <Card sx={{ padding: "10px", mt: 1 }} key={i}>
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
              <img src={IF + post.photo} className="w-3/4 mx-auto" alt="" />
            </div>
            {post.desc && (
              <div className="mt-4">
                {post.desc.split("\\n").map((paragraph, index) => (
                  <div key={index}>
                    <p key={index} style={{ wordWrap: "break-word" }}>
                      {paragraph}
                    </p>
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
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                        error={null}
                        autoFocus={false}
                        password={false}
                        showPassword={null}
                        enterFunction={(e) => {
                          if (e.key === "Enter") {
                            postComment(e);
                          }
                        }}
                        handleClick={null}
                        handleShow={null}
                        maxLength={200}
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
          </Stack>
        </PostContainer>
      )}
      <div style={{ height: "400px" }} />
    </div>
  );
};

export default PostDetails;
