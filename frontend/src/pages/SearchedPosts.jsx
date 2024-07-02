import React from "react";
import axios from "axios";
import HomePosts from "../components/Posts";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { URL } from "../url";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const SearchedPosts = () => {
  const { searchquery } = useParams();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loader, setLoader] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchPosts();
    console.log("Fetched");
  }, [searchquery]);

  const fetchPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/");
      console.log(res.data);
      const filteredPosts = res.data.filter(
        (post) =>
          post.title.toLowerCase().includes(searchquery.toLowerCase()) ||
          post.desc.toLowerCase().includes(searchquery.toLowerCase())
      );
      const sortedPosts = filteredPosts.reverse();
      console.log(sortedPosts);
      setPosts(sortedPosts);
      setNoResults(sortedPosts.length === 0);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const handleFilter = (event) => {
    setFilter(event.target.value);
  };

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
              <h1 className="font-bold mb-5 mt-5">
                {posts.length} results for '{searchquery}'
              </h1>
            ) : (
              <h1 className="font-bold mb-5 mt-5">
                {posts.length} result for '{searchquery}'
              </h1>
            )}
            {posts.length > 0 && (
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel color="secondary" id="demo-select-small-label">
                    Sort
                  </InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={filter}
                    label="Filter"
                    onChange={handleFilter}
                    color="secondary"
                  >
                    <MenuItem value="">
                      <em>Default</em>
                    </MenuItem>
                    <MenuItem value={"Newest"}>Newest</MenuItem>
                    <MenuItem value={"Oldest"}>Oldest</MenuItem>
                    <MenuItem value={"Title"}>Title</MenuItem>
                    <MenuItem value={"Author"}>Author</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-8 md:px-[200px]">
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          posts.map((post) => (
            <Link to={`/posts/post/${post._id}`} key={post._id}>
              <HomePosts key={post._id} post={post} />
            </Link>
          ))
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
      <div className="mb-10" />
    </>
  );
};

export default SearchedPosts;
