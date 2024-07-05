import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import classes from "./HomeLoader.module.css";

const HomeLoader = () => {
  return (
    <Box className={classes.box}>
      <Stack spacing={"10px"}>
        <Skeleton variant="text" sx={{ fontSize: "24px" }} />
        <Skeleton variant="rounded" height={300} />
        <Skeleton variant="text" sx={{ fontSize: "24px" }} />
        <div className={classes.container}>
          <Skeleton variant="rounded" height={300} className={classes.post} />
          <Skeleton variant="rounded" height={300} className={classes.post} />
          <Skeleton variant="rounded" height={300} className={classes.post} />
          <Skeleton variant="rounded" height={300} className={classes.post} />
          <Skeleton variant="rounded" height={300} className={classes.post} />
          <Skeleton variant="rounded" height={300} className={classes.post} />
        </div>
      </Stack>
      <div style={{ marginBottom: "100px" }} />
    </Box>
  );
};

export default HomeLoader;
