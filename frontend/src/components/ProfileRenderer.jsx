import { UserContext } from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../url";
import ProfileSection from "./ProfileSection";
import PostContainer from "../ui/container/PostContainer";
import PostRenderer from "./PostRenderer";

const ProfileRenderer = () => {
  const param = useParams().id; // USER ID
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const { user } = useContext(UserContext);
  const [visitor, setVisitor] = useState(true);
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
        setEmail(res.data.email);
      } else {
        setVisitor(false);
        const res = await axios.get(URL + "/api/users/" + user._id);
        setUsername(res.data.username);
        setEmail(res.data.email);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(true);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [param, user]);

  return (
    <>
      {loading ? (
        <p>loading</p>
      ) : (
        <div>
          {visitor === true && username !== "" ? (
            <>
              <PostContainer>
                <ProfileSection
                  username={`${username}'s Profile`}
                  visitor={visitor}
                />
              </PostContainer>
              <PostRenderer
                route={"/api/posts/user/" + param}
                headerText={`${username}'s Posts`}
                altText={`${username} doesn't have any posts`}
                sortable={false}
                searchable={false}
                searchquery={""}
              />
            </>
          ) : (
            <>
              <PostContainer>
                <ProfileSection username={"Your Profile"} visitor={visitor} />
              </PostContainer>
              <PostRenderer
                route={"/api/posts/user/" + user._id}
                headerText={"Your Posts"}
                altText={"You don't have any posts"}
                sortable={false}
                searchable={false}
                searchquery={""}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileRenderer;
