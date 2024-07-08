import { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import ProfileRenderer from "../components/profile/ProfileRenderer";
import AlertMessage from "../components/AlertMessage";

const Profile = ({ alert, setAlert }) => {
  // State variables
  const param = useParams().id; // USER ID
  const [username, setUsername] = useState("");
  const { user } = useContext(UserContext);
  const [visitor, setVisitor] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches user profile data from the server.
   * Sets username and email if successful.
   * Logs error if request fails.
   */
  const fetchProfile = async () => {
    setLoading(true);
    if (!user || !user._id) return;
    try {
      if (param !== user?._id) {
        setVisitor(true);
        const res = await axios.get(URL + "/api/users/" + param);
        setUsername(res.data.username);
      } else {
        setVisitor(false);
        const res = await axios.get(URL + "/api/users/" + user._id);
        setUsername(res.data.username);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  };

  /**
   * Fetches user posts from the server.
   * Sets posts state with fetched data.
   * Logs error if request fails.
   */
  const fetchUserPosts = async () => {
    setLoading(true);
    if (!user || !user._id) return;
    try {
      if (visitor) {
        const res = await axios.get(URL + "/api/posts/user/" + param);
        setPosts(res.data.reverse());
        setLoading(false);
      } else {
        const res = await axios.get(URL + "/api/posts/user/" + user._id);
        setPosts(res.data.reverse());
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [param, user]);

  useEffect(() => {
    fetchProfile();
  }, [param, user]);

  return (
    <>
      <Navbar query={""} />
      {alert && alert.open === true && alert.type === "profile" && (
        <AlertMessage message={alert.message} setAlert={setAlert} />
      )}
      <ProfileRenderer
        loading={loading}
        visitor={visitor}
        username={username}
        param={param}
        user={user}
        posts={posts}
        setAlert={setAlert}
      />
    </>
  );
};

export default Profile;
