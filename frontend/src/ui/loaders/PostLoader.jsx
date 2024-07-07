import Skeleton from "@mui/material/Skeleton";

const PostLoader = () => {
  return (
    <>
      <Skeleton variant="text" sx={{ fontSize: "24px" }} width={"100%"} />
      <Skeleton variant="rounded" height={200} width={"100%"} />
      <Skeleton variant="rounded" height={200} width={"100%"} />
      <Skeleton variant="rounded" height={200} width={"100%"} />
      <Skeleton variant="rounded" height={200} width={"100%"} />
      <Skeleton variant="rounded" height={200} width={"100%"} />
      <Skeleton variant="text" sx={{ fontSize: "24px" }} width={"100%"} />
    </>
  );
};

export default PostLoader;
