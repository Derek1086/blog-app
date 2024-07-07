import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";

const MyFavorites = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar query={""} />
      {!user ? (
        <></>
      ) : (
        <PostRenderer
          route={"/api/users/" + user._id + "/favorites"}
          headerText={"Your Favorites"}
          altText={"You don't have any favorites"}
          sortable={true}
        />
      )}
    </>
  );
};

export default MyFavorites;
