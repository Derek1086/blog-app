import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import BodyText from "../ui/text/BodyText";
import { formatDistanceToNow } from "date-fns";

import classes from "./Featured.module.css";

const Featured = ({ post }) => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        marginTop: "10px",
        height: "300px",
      }}
    >
      <div className={classes.image}>
        <CardMedia
          component="img"
          sx={{ height: "300px" }}
          image={IF + post.photo}
          alt=""
        />
      </div>
      <div className={classes.content}>
        <div style={{ height: "200px" }}>
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>
            {post.title}
          </span>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <BodyText
              text={post.username}
              variant={"body2"}
              color={"text.secondary"}
            />
            <BodyText
              text={formatDistanceToNow(new Date(post.updatedAt), {
                addSuffix: true,
              })}
              variant={"body2"}
              color={"text.secondary"}
            />
          </div>
          <p
            className={classes.desc}
            style={{ wordWrap: "break-word", fontSize: "14px" }}
          >
            {post.desc
              .replace(/\n/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 220) + "..."}
          </p>

          <div className={classes.actions}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                width: "30%",
                marginTop: "10px",
                backgroundColor: "gray",
              }}
            >
              Read More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Featured;
