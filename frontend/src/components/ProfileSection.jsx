import MainContainer from "../ui/container/MainContainer";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

const ProfileSection = ({ username, visitor }) => {
  return (
    <>
      <MainContainer justifyContent="left">
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {username}
        </p>
        {!visitor && (
          <IconButton>
            <EditIcon />
          </IconButton>
        )}
      </MainContainer>
    </>
  );
};

export default ProfileSection;
