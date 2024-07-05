import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";

import classes from "./Posts.module.css";

const HomePosts = ({ post }) => {
  return (
    <Card className={classes.content}>
      <div>
        <CardMedia
          component="img"
          sx={{ height: "200px", width: "100%" }}
          image={IF + post.photo}
          alt=""
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "10px",
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

export default HomePosts;
