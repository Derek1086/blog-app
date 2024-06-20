import { IF } from "../url";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

import classes from "./HomePosts.module.css";

const HomePosts = ({ post }) => {
  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <div className={classes.image}>
          <CardMedia
            component="img"
            sx={{ width: "100%", height: "200px" }}
            image={IF + post.photo}
            alt=""
          />
        </div>
        <div className={classes.content}>
          <div style={{ height: "70%" }}>
            <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
              {post.title}
            </h1>
            <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
              <p>@{post.username}</p>
              <div className={`flex space-x-2 text-sm ${classes.date}`}>
                <p>{new Date(post.updatedAt).toString().slice(0, 15)}</p>
                <p>{new Date(post.updatedAt).toString().slice(16, 24)}</p>
              </div>
            </div>
            <p className="text-sm md:text-lg">
              {post.desc.slice(0, 200) + "..."}
            </p>
          </div>
          <div className={classes.actions}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ backgroundColor: "gray", width: "30%", marginTop: "10px" }}
            >
              Read More
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HomePosts;
