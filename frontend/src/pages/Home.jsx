import axios from "axios";
import HomePosts from "../components/Posts";
import Navbar from "../components/Navbar";
import { URL } from "../url";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import Featured from "../components/Featured";
import CustomPagination from "../ui/container/CustomPagination";
import HomeLoader from "../ui/loaders/HomeLoader";

import classes from "./Home.module.css";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  const handleChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + search);
      const sortedPosts = res.data.reverse();
      setPosts(sortedPosts);
      if (sortedPosts.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <>
      <Navbar query={""} />
      <div className="px-8 md:px-[200px]">
        {loader ? (
          <HomeLoader />
        ) : !noResults && currentPosts.length > 0 ? (
          <>
            <HeaderText fontsize={"20px"} text="Featured" textalign={"left"} />
            <Link to={`/posts/post/${posts[0]._id}`}>
              <Featured post={posts[0]} />
            </Link>
            <HeaderText
              fontsize={"20px"}
              text="Recent Posts"
              textalign={"left"}
            />
          </>
        ) : (
          <></>
        )}
        <div className={classes.container}>
          {loader ? (
            <></>
          ) : !noResults ? (
            currentPosts.map((post) => (
              <Link to={`/posts/post/${post._id}`} key={post._id}>
                <HomePosts key={post._id} post={post} />
              </Link>
            ))
          ) : (
            <div className="mt-10">
              <BodyText
                text={"No posts available"}
                variant={"body1"}
                color={"white"}
                textalign={"center"}
              />
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      <CustomPagination
        posts={posts}
        postsPerPage={postsPerPage}
        page={page}
        handleChange={handleChange}
      />
      <div className="mb-10" />
    </>
  );
};

export default Home;
