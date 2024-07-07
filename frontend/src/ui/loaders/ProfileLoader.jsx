import Skeleton from "@mui/material/Skeleton";

const ProfileLoader = () => {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "24px" }} width={"100%"} />
      <Skeleton variant="rounded" height={250} width={"100%"} />
    </>
  );
};

export default ProfileLoader;
