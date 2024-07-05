import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";

import classes from "./ProfilePosts.module.css";

const ProfilePosts = ({ post }) => {
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
        <div className={classes.title}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              wordWrap: "break-word",
            }}
          >
            {post.title}
          </span>
        </div>
        <p
          className={classes.desc}
          style={{ wordWrap: "break-word", fontSize: "14px" }}
        >
          {post.desc
            .replace(/\n/g, " ")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 150) + "..."}
        </p>
        <div className={classes.date}>
          <BodyText
            text={formatDistanceToNow(new Date(post.updatedAt), {
              addSuffix: true,
            })}
            variant={"body2"}
            color={"text.secondary"}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProfilePosts;
