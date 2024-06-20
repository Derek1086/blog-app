import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { IF, URL } from "../url";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext";
import Pagination from "@mui/material/Pagination";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  //const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const postsPerPage = 1;

  const handleChange = (event, value) => {
    console.log(event);
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

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

  console.log(posts);

  return (
    <>
      <Navbar />
      <div className="px-8 md:px-[200px]">
        <h1 className="font-bold mb-5 mt-5">Recent Posts</h1>
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          currentPosts.map((post) => (
            <Link
              // to={user ? `/posts/post/${post._id}` : "/login"}
              to={`/posts/post/${post._id}`}
              key={post.id}
            >
              <HomePosts key={post._id} post={post} />
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10px",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <Pagination
          size="medium"
          shape="rounded"
          count={Math.ceil(posts.length / postsPerPage)}
          page={page}
          onChange={handleChange}
          sx={{
            "& .MuiPaginationItem-root": {
              marginX: 1,
            },
            "@media screen and (max-width: 768px)": {
              "& .MuiPaginationItem-root": {
                marginX: 0,
              },
            },
          }}
        />
      </div>
    </>
  );
};

export default Home;
