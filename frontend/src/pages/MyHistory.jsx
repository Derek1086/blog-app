import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostRenderer from "../components/PostRenderer";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import PostContainer from "../ui/container/PostContainer";
import CustomModal from "../ui/container/CustomModal";

const MyHistory = () => {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);

  /**
   * Fetches the user's post history from the server and updates the state.
   * This effect runs when the component mounts or the `user` changes.
   */
  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        try {
          const res = await axios.get(
            URL + "/api/users/" + user._id + "/history"
          );
          setHistory(res.data);
        } catch (error) {
          console.error("Error fetching history:", error);
        }
      }
    };

    fetchHistory();
  }, [user]);

  /**
   * Clears the user's post history by sending a DELETE request to the server.
   * Updates the state and reloads the page upon successful deletion.
   */
  const clearHistory = async () => {
    if (user) {
      try {
        const response = await axios.delete(
          URL + "/api/users/" + user._id + "/history",
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("History cleared successfully");
          setHistory([]);
          window.location.reload();
        } else {
          console.log("Failed to clear history");
        }
      } catch (error) {
        console.error("Error clearing history:", error);
        console.log("Error clearing history");
      }
    }
  };

  return (
    <>
      <Navbar query={""} />
      {!user ? (
        <></>
      ) : (
        <>
          {history && history.length > 0 && (
            <>
              <CustomModal
                open={open}
                onClose={() => setOpen(false)}
                title={"Are you sure you want to clear your history?"}
                leftButtonText="Back"
                leftButtonClick={() => setOpen(false)}
                rightButtonText="Delete"
                rightButtonClick={clearHistory}
              />
              <PostContainer>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="secondary"
                  onClick={() => setOpen(true)}
                >
                  Clear History
                </Button>
              </PostContainer>
            </>
          )}
          <PostRenderer
            route={"/api/users/" + user._id + "/history"}
            headerText={"Your History"}
            altText={"No history available"}
            sortable={false}
            searchable={false}
            searchquery={""}
          />
        </>
      )}
    </>
  );
};

export default MyHistory;
