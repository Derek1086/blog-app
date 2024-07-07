import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";

const MyBlogs = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar query={""} />
      {!user ? (
        <></>
      ) : (
        <PostRenderer
          route={"/api/posts/user/" + user._id}
          headerText={"Your Posts"}
          altText={"You don't have any posts"}
          sortable={true}
          searchable={false}
          searchquery={""}
        />
      )}
    </>
  );
};

export default MyBlogs;
