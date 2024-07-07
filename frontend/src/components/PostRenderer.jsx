import React, { useState, useEffect } from "react";
import axios from "axios";
import PostContainer from "../ui/container/PostContainer";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import PostLoader from "../ui/loaders/PostLoader";
import CustomSelect from "../ui/input/CustomSelect";
import { Link } from "react-router-dom";
import { URL } from "../url";
import BlogPost from "./BlogPost";
import CustomPagination from "../ui/container/CustomPagination";

const PostRenderer = ({ route, headerText, altText, sortable }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);
  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  /**
   * Handles change in pagination page.
   * Updates the current page number.
   * @param {Object} event - The event object from the pagination component.
   * @param {number} value - The new page number selected.
   */
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  /**
   * Handles change in filter selection.
   * Updates the filter state based on user selection.
   * @param {Object} event - The event object from the filter input/select component.
   */
  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  /**
   * Fetches posts from the server based on the search query.
   * Sets fetched posts to state.
   * Checks if no results are found and updates state accordingly.
   * Logs error if request fails.
   */
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL + route);
      const sortedPosts = sortPosts(res.data);
      setPosts(sortedPosts);
      setNoResults(sortedPosts.length === 0);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      setLoading(true);
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
      case "Default":
        return posts.reverse();
      default:
        return posts.reverse();
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [route]);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  return (
    <PostContainer>
      {loading ? (
        <PostLoader />
      ) : noResults ? (
        <div style={{ width: "100%" }}>
          <BodyText
            text={altText}
            variant={"body1"}
            color={"white"}
            textalign={"center"}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {sortable ? (
              <>
                <HeaderText
                  fontsize={"18px"}
                  text={headerText}
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
                  ]}
                />
              </>
            ) : (
              <HeaderText
                fontsize={"18px"}
                text="Recent Posts"
                textalign={"left"}
              />
            )}
          </div>

          {currentPosts.map((post) => (
            <Link to={`/posts/post/${post._id}`} key={post._id}>
              <BlogPost key={post._id} post={post} />
            </Link>
          ))}
          {/* Pagination */}
          <CustomPagination
            posts={posts}
            postsPerPage={postsPerPage}
            page={page}
            handleChange={handlePageChange}
          />
          <div className="mb-10" />
        </>
      )}
    </PostContainer>
  );
};

export default PostRenderer;
