import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import MainContainer from "../ui/container/MainContainer";
import Divider from "@mui/material/Divider";
import { formatDistanceToNow } from "date-fns";

import classes from "./BlogPost.module.css";

const BlogPost = ({ post }) => {
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

          <p
            className={classes.desc}
            style={{ wordWrap: "break-word", fontSize: "14px" }}
          >
            {post.desc
              .replace(/\n/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 300) + "..."}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BlogPost;
