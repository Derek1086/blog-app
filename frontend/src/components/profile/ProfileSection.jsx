import { useState } from "react";
import MainContainer from "../../ui/container/MainContainer";
import IconButton from "@mui/material/IconButton";
import BodyText from "../../ui/text/BodyText";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import BlogPost from "../BlogPost";
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";
import EditProfile from "./EditProfile";

import classes from "./ProfileSection.module.css";

const ProfileSection = ({ username, visitor, posts, setAlert }) => {
  const [editing, setEditing] = useState(false);

  /**
   * Calculates the total view count of all posts.
   * @param {Array} posts - Array of post objects.
   * @returns {number} Total view count.
   */
  const findViewCount = (posts) => {
    let count = 0;
    for (let i = 0; i < posts.length; i++) {
      count += posts[i].viewCount;
    }
    return count;
  };

  /**
   * Finds the post with the highest view count.
   * @param {Array} posts - Array of post objects.
   * @returns {Object|null} The post with the highest view count or null if no posts exist.
   */
  const findPopularPost = (posts) => {
    if (posts.length === 0) return null;

    let popularPost = posts[0];
    for (let i = 1; i < posts.length; i++) {
      if (posts[i].viewCount > popularPost.viewCount) {
        popularPost = posts[i];
      }
    }
    return popularPost;
  };

  /**
   * Counts the number of posts that have at least one favorite.
   * @param {Array} posts - Array of post objects.
   * @returns {number} Number of favorited posts.
   */
  const countFavoritedPosts = (posts) => {
    let count = 0;
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].favoritedBy && posts[i].favoritedBy.length > 0) {
        count++;
      }
    }
    return count;
  };

  if (!posts) {
    return <></>;
  }

  const popularPost = findPopularPost(posts);

  return (
    <>
      <MainContainer justifyContent="left">
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {username}
        </p>
        {!visitor && (
          <IconButton onClick={() => setEditing(!editing)}>
            {editing ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        )}
      </MainContainer>
      {posts && !editing ? (
        <div className={classes.info}>
          <div className={classes.stats}>
            <Stack spacing={2}>
              <BodyText
                text={`Posts created: ${posts.length}`}
                variant={"body2"}
                color={"text.secondary"}
              />
              <BodyText
                text={`Total views: ${findViewCount(posts)}`}
                variant={"body2"}
                color={"text.secondary"}
              />
              <BodyText
                text={`Favorited posts: ${countFavoritedPosts(posts)}`}
                variant={"body2"}
                color={"text.secondary"}
              />
            </Stack>
          </div>
          <div className={classes.popular}>
            {popularPost && (
              <>
                <BodyText
                  text={"Most popular post:"}
                  variant={"body2"}
                  color={"text.secondary"}
                />
                <Link to={`/posts/post/${popularPost._id}`}>
                  <BlogPost post={popularPost} />
                </Link>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={classes.info}>
          <EditProfile setAlert={setAlert} setProfileEditing={setEditing} />
        </div>
      )}
    </>
  );
};

export default ProfileSection;
