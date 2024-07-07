import React from "react";
import axios from "axios";
import HomePosts from "../components/Posts";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { URL } from "../url";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeaderText from "../ui/text/HeaderText";
import MyPostsLoader from "../ui/loaders/MyPostsLoader";
import CustomSelect from "../ui/input/CustomSelect";
import CustomPagination from "../ui/container/CustomPagination";

/**
 * Component for displaying posts based on search query and filtering.
 * Fetches posts from the server based on search query.
 * Handles filtering posts by newest, oldest, title, author, and default sorting.
 */
const SearchedPosts = () => {
  // State variables
  const { searchquery } = useParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts || []);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState("");
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

  useEffect(() => {
    fetchPosts();
  }, [searchquery, filter]);

  /**
   * Handles fetching posts from the server based on search query.
   * Sets fetched posts to state and handles sorting based on the selected filter.
   * Sets noResults state if no posts are found.
   * Logs error if request fails.
   */
  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/");
      const filteredPosts = res.data.filter(
        (post) =>
          post.title.toLowerCase().includes(searchquery.toLowerCase()) ||
          post.desc.toLowerCase().includes(searchquery.toLowerCase())
      );
      const sortedPosts = sortPosts(filteredPosts);
      setPosts(sortedPosts);
      setNoResults(sortedPosts.length === 0);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  /**
   * Sorts posts based on the selected filter.
   * @param {Array} posts - The array of posts to be sorted.
   * @returns {Array} - The sorted array of posts based on the selected filter.
   */
  const sortPosts = (posts) => {
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
      case "Author":
        return posts.sort((a, b) => a.username.localeCompare(b.username));
      case "Default":
        return posts.reverse();
      default:
        return posts.reverse();
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
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <>
      <Navbar query={searchquery} />
      <div className="px-8 md:px-[200px]">
        {!loader && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {posts.length !== 1 ? (
              <>
                <HeaderText
                  fontsize={"18px"}
                  text={`${posts.length} results for '${searchquery}'`}
                  textalign={"left"}
                />
                <CustomSelect
                  filter={filter}
                  handleFilter={handleFilter}
                  filters={[
                    { value: "default", label: "Default" },
                    { value: "Newest", label: "Newest" },
                    { value: "Oldest", label: "Oldest" },
                    { value: "Title", label: "Title" },
                    { value: "Author", label: "Author" },
                  ]}
                />
              </>
            ) : (
              <>
                <HeaderText
                  fontsize={"18px"}
                  text={`${posts.length} result for '${searchquery}'`}
                  textalign={"left"}
                />
              </>
            )}
          </div>
        )}
      </div>
      <div className={`px-8 md:px-[200px]`}>
        {loader ? (
          <div className="mt-14">
            <MyPostsLoader />
          </div>
        ) : !noResults ? (
          currentPosts.map((post) => (
            <Link to={`/posts/post/${post._id}`} key={post._id}>
              <HomePosts key={post._id} post={post} />
            </Link>
          ))
        ) : (
          <></>
        )}
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

export default SearchedPosts;
