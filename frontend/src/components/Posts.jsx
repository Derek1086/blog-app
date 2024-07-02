import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";

import classes from "./Posts.module.css";

const HomePosts = ({ post }) => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        marginTop: "10px",
        height: "200px",
      }}
    >
      <div className={classes.image}>
        <CardMedia
          component="img"
          sx={{ height: "200px" }}
          image={IF + post.photo}
          alt=""
        />
      </div>
      <div className={classes.content}>
        <div style={{ height: "200px" }}>
          <h1 className={classes.title}>{post.title}</h1>
          <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between">
            <p>@{post.username}</p>
            <div className={`flex space-x-2 text-sm ${classes.date}`}>
              <p className={classes.date}>
                {new Date(post.updatedAt).toString().slice(0, 15)}
              </p>
              <p className={classes.date}>
                {new Date(post.updatedAt).toString().slice(16, 24)}
              </p>
            </div>
          </div>
          <p style={{ wordWrap: "break-word", fontSize: "14px" }}>
            {post.desc
              .replace(/\n/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 150) + "..."}
          </p>

          <div className={classes.actions}>
            <Button
              variant="contained"
              color="secondary"
              sx={{
                width: "30%",
                marginTop: "10px",
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

export default HomePosts;
