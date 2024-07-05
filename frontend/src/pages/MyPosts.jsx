import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import HomePosts from "../components/Posts";
import MyPostsLoader from "../ui/loaders/MyPostsLoader";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";

import classes from "./Home.module.css";

const MyBlogs = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const { user } = useContext(UserContext);

  /**
   * Handles fetching the user's posts.
   */
  const fetchPosts = async () => {
    setLoader(true);
    setNoResults(false);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      setPosts(res.data.reverse());
      if (res.data.length === 0) {
        setNoResults(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [search, user]);

  return (
    <div>
      <Navbar query={""} />
      <div className="mt-5" />
      <div className="px-8 md:px-[200px]">
        <HeaderText fontsize={"20px"} text="Your Posts" textalign={"center"} />
        <div className="mt-5" />
        <div className={classes.container}>
          {loader ? (
            <MyPostsLoader />
          ) : noResults ? (
            <BodyText
              text={"You have not posted anything yet"}
              variant={"body1"}
              color={"white"}
              textalign={"center"}
            />
          ) : (
            posts.map((post) => (
              <Link
                to={user ? `/posts/post/${post._id}` : "/login"}
                key={post._id}
              >
                <HomePosts key={post._id} post={post} />
              </Link>
            ))
          )}
        </div>
      </div>
      <div className="mb-10" />
    </div>
  );
};

export default MyBlogs;
