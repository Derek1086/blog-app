import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";
import { useParams } from "react-router-dom";

const SearchedPosts = () => {
  const { searchquery } = useParams();
  const [isQueryLoaded, setIsQueryLoaded] = useState(false);

  useEffect(() => {
    if (searchquery) {
      setIsQueryLoaded(true);
    }
  }, [searchquery]);

  return (
    <>
      <Navbar query={searchquery || ""} />
      {isQueryLoaded ? (
        <PostRenderer
          route={"/api/posts/"}
          headerText={`Results for "${searchquery}"`}
          altText={`No results found for "${searchquery}"`}
          sortable={true}
          searchable={true}
          searchquery={searchquery}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SearchedPosts;
