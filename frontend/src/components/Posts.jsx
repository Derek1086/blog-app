import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";
import Divider from "@mui/material/Divider";

import classes from "./Posts.module.css";

const HomePosts = ({ post }) => {
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
    <Card className={classes.content}>
      <CardMedia
        component="img"
        sx={{ height: "200px", width: "100%" }}
        image={IF + post.photo}
        alt=""
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "10px",
          gap: "2px",
        }}
      >
        <HeaderText fontsize={"16px"} text={post.title} textalign={"left"} />
        <BodyText
          text={post.username}
          variant={"body2"}
          color={"text.secondary"}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <BodyText
            text={formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
            variant={"body2"}
            color={"text.secondary"}
          />
          <Divider sx={{ height: 20 }} orientation="vertical" />
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
        </div>
      </div>
    </Card>
  );
};

export default HomePosts;
