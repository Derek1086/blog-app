import { useState, useEffect } from "react";
import axios from "axios";
import { URL, IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import MainContainer from "../ui/container/MainContainer";
import Divider from "@mui/material/Divider";
import { formatDistanceToNow } from "date-fns";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

import classes from "./BlogPost.module.css";

const BlogPost = ({ post }) => {
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [comments, setComments] = useState([]);

  /**
   * Fetches favorite count associated with the post from the server.
   * Sets the fetched favorite count to state.
   * Logs error if request fails.
   */
  const fetchFavoriteCount = async () => {
    try {
      const res = await axios.get(
        URL + "/api/posts/" + post._id + "/favoriteCount"
      );
      setFavoriteCount(res.data);
    } catch (error) {
      console.error("Error fetching favorite count:", error);
    }
  };

  /**
   * Fetches comments associated with the post from the server.
   * Sets the fetched comments to state.
   * Logs error if request fails.
   */
  const fetchPostComments = async () => {
    try {
      const res = await axios.get(URL + "/api/comments/post/" + post._id);
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (post) {
      fetchFavoriteCount();
      fetchPostComments();
    }
  }, [post]);

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

  if (!post) return <></>;

  return (
    <Card className={classes.container}>
      <div className={classes.image}>
        <CardMedia
          component="img"
          sx={{ height: "200px" }}
          image={IF + post.photo}
          alt=""
        />
      </div>
      <div className={classes.content}>
        <div>
          <HeaderText fontsize={"18px"} text={post.title} textalign={"left"} />
          <div className="mt-1" />
          <BodyText
            text={post.username}
            variant={"body2"}
            color={"text.secondary"}
          />
          <div className="mt-1" />
          <MainContainer justifyContent={"left"}>
            {post.viewCount !== 1 ? (
              <BodyText
                text={formatViewCount(post.viewCount) + " views"}
                variant={"body2"}
                color={"text.secondary"}
              />
            ) : (
              <BodyText
                text={post.viewCount + " view"}
                variant={"body2"}
                color={"text.secondary"}
              />
            )}
            <Divider sx={{ height: 20 }} orientation="vertical" />
            <BodyText
              text={formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
              variant={"body2"}
              color={"text.secondary"}
            />
          </MainContainer>
          <div className="mt-1" />
          <div className={classes.desc}>
            <p style={{ wordWrap: "break-word", fontSize: "14px" }}>
              {post.desc
                .replace(/\n/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 180) + "..."}
            </p>
          </div>
        </div>
        <Divider sx={{ marginTop: "10px" }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "10px 0px 10px 0px",
          }}
        >
          <FavoriteBorderIcon />
          <BodyText
            text={favoriteCount ? favoriteCount : "0"}
            variant={"body2"}
            color={"text.secondary"}
          />
          <div style={{ width: "10px" }} />
          <ChatBubbleOutlineIcon />
          <BodyText
            text={comments.length ? comments.length : "0"}
            variant={"body2"}
            color={"text.secondary"}
          />
        </div>
      </div>
    </Card>
  );
};

export default BlogPost;
