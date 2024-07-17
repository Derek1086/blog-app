import ProfileSection from "./ProfileSection";
import PostContainer from "../../ui/container/PostContainer";
import PostRenderer from "../PostRenderer";
import ProfileLoader from "../../ui/loaders/ProfileLoader";

const ProfileRenderer = ({
  loading,
  visitor,
  username,
  param,
  user,
  posts,
  setAlert,
}) => {
  return (
    <>
      {loading ? (
        <PostContainer>
          <ProfileLoader />
        </PostContainer>
      ) : (
        <div>
          {visitor === true && username !== "" ? (
            <>
              <PostContainer>
                <ProfileSection
                  username={username}
                  visitor={visitor}
                  posts={posts}
                  user={null}
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
                <ProfileSection
                  username={"Your Profile"}
                  visitor={visitor}
                  posts={posts}
                  setAlert={setAlert}
                  user={user}
                />
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
