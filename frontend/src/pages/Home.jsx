import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";

const Home = () => {
  return (
    <>
      <Navbar query={""} />
      <PostRenderer
        route={"/api/posts/"}
        headerText={"Recent Posts"}
        altText={"No posts available"}
        sortable={false}
      />
    </>
  );
};

export default Home;
