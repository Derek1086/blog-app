import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";
import AlertMessage from "../components/AlertMessage";

const Home = ({ alert, setAlert }) => {
  return (
    <>
      <Navbar query={""} />
      {alert &&
        alert.open === true &&
        (alert.type === "login" || alert.type === "delete") && (
          <AlertMessage message={alert.message} setAlert={setAlert} />
        )}
      <PostRenderer
        route={"/api/posts/"}
        headerText={"Recent Posts"}
        altText={"No posts available"}
        sortable={false}
        searchable={false}
        searchquery={""}
      />
    </>
  );
};

export default Home;
