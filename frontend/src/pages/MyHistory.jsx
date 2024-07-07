import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";

const MyHistory = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Navbar query={""} />
      {!user ? (
        <></>
      ) : (
        <PostRenderer
          route={"/api/users/" + user._id + "/history"}
          headerText={"Your History"}
          altText={"No history available"}
          sortable={false}
          searchable={false}
          searchquery={""}
        />
      )}
    </>
  );
};

export default MyHistory;
