import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import PostContainer from "../ui/container/PostContainer";
import CustomModal from "../ui/container/CustomModal";
import AlertMessage from "../components/AlertMessage";
import BodyText from "../ui/text/BodyText";
import BlogPost from "../components/BlogPost";

const MyHistory = ({ alert, setAlert }) => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  /**
   * Fetches the user's post history from the server and updates the state.
   * This effect runs when the component mounts or the `user` changes.
   */
  const fetchHistory = async () => {
    if (user) {
      try {
        const res = await axios.get(
          URL + "/api/users/" + user._id + "/history"
        );
        setHistory(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }
  };

  /**
   * Fetches a single post by ID and updates the `posts` state.
   * @param {string} postId - ID of the post to fetch.
   */
  const fetchPost = async (postID) => {
    if (user) {
      try {
        const res = await axios.get(URL + "/api/posts/" + postID + "/history");
        setPosts((prevPosts) => [...prevPosts, res.data]);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    }
  };

  const fetchPosts = async () => {
    if (history.length > 0) {
      await Promise.all(history.map((postId) => fetchPost(postId)));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [history]);

  /**
   * Clears the user's post history by sending a DELETE request to the server.
   * Updates the state and reloads the page upon successful deletion.
   */
  const clearHistory = async () => {
    if (user) {
      try {
        const response = await axios.delete(
          URL + "/api/users/" + user._id + "/history",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setHistory([]);
          setAlert({
            open: true,
            message: "History cleared successfully",
            type: "history",
          });
        } else {
          console.log("Failed to clear history");
        }
      } catch (error) {
        console.error("Error clearing history:", error);
      }
    }
  };

  return (
    <>
      <Navbar query={""} />
      {alert && alert.open === true && alert.type === "history" && (
        <AlertMessage message={alert.message} setAlert={setAlert} />
      )}
      {!user ? (
        <></>
      ) : (
        <>
          {history && history.length > 0 ? (
            <div className="mb-10">
              <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={"Are you sure you want to clear your history?"}
                leftButtonText="Back"
                leftButtonClick={() => setOpen(false)}
                rightButtonText="Clear"
                rightButtonClick={clearHistory}
              />
              <PostContainer>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  onClick={() => setOpen(true)}
                >
                  Clear History
                </Button>
                {posts.map((post) => (
                  <Link to={`/posts/post/${post._id}`} key={post._id}>
                    <BlogPost post={post} />
                  </Link>
                ))}
              </PostContainer>
            </div>
          ) : (
            <PostContainer>
              <BodyText
                text={"No history available"}
                variant={"body1"}
                color={"white"}
                textalign={"center"}
              />
            </PostContainer>
          )}
        </>
      )}
    </>
  );
};

export default MyHistory;
