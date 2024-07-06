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
import CustomPagination from "../ui/container/CustomPagination";
import CustomSelect from "../ui/input/CustomSelect";

import classes from "./Home.module.css";

const MyBlogs = () => {
  // State variables
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState("");
  const { user } = useContext(UserContext);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;

  /**
   * Handles change in pagination page.
   * Updates the current page number.
   * @param {Object} event - The event object from the pagination component.
   * @param {number} value - The new page number selected.
   */
  const handleChange = (event, value) => {
    setPage(value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  /**
   * Handles fetching the user's posts from the server.
   * Sets fetched posts to state and handles sorting based on the selected filter.
   * Sets noResults state if no posts are found.
   * Logs error if request fails.
   */
  const fetchPosts = async () => {
    setLoader(true);
    setNoResults(false);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id);
      const sortedPosts = sortPosts(res.data);
      setPosts(sortedPosts);
      if (res.data.length === 0) {
        setNoResults(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  /**
   * Handles change in filter selection.
   * Updates the filter state based on user selection.
   * @param {Object} event - The event object from the filter input/select component.
   */
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [search, user]);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  /**
   * Sorts posts based on the selected filter.
   * @param {Array} posts - The array of posts to be sorted.
   * @returns {Array} - The sorted array of posts based on the selected filter.
   */
  const sortPosts = (posts) => {
    console.log("filtering");
    switch (filter) {
      case "Newest":
        return posts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "Oldest":
        return posts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "Title":
        return posts.sort((a, b) => a.title.localeCompare(b.title));
      case "Default":
        return posts.reverse();
      default:
        return posts.reverse();
    }
  };

  return (
    <div>
      <Navbar query={""} />
      <div className="px-8 md:px-[200px]">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <HeaderText fontsize={"18px"} text="Your Posts" textalign={"left"} />
          <CustomSelect
            filter={filter}
            handleFilter={handleFilter}
            filters={[
              { value: "default", label: "Default" },
              { value: "Newest", label: "Newest" },
              { value: "Oldest", label: "Oldest" },
              { value: "Title", label: "Title" },
            ]}
          />
        </div>
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
            currentPosts.map((post) => (
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
      {/* Pagination */}
      <CustomPagination
        posts={posts}
        postsPerPage={postsPerPage}
        page={page}
        handleChange={handleChange}
      />
      <div className="mb-10" />
    </div>
  );
};

export default MyBlogs;
