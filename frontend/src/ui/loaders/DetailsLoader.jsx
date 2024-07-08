import Skeleton from "@mui/material/Skeleton";

const DetailsLoader = () => {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "28px" }} width={"100%"} />
      <Skeleton variant="text" sx={{ fontSize: "28px" }} width={"100%"} />
      <Skeleton variant="text" sx={{ fontSize: "34px" }} width={"100%"} />
      <Skeleton variant="rounded" height={800} width={"100%"} />
    </>
  );
};

export default DetailsLoader;
