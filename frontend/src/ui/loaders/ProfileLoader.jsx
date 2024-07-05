import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

import classes from "../../components/ProfilePosts.module.css";

const ProfileLoader = () => {
  return (
    <Box>
      <Skeleton variant="rounded" className={classes.container} height={200} />
      <Skeleton variant="rounded" className={classes.container} height={200} />
      <Skeleton variant="rounded" className={classes.container} height={200} />
      <Skeleton variant="rounded" className={classes.container} height={200} />
      <Skeleton variant="rounded" className={classes.container} height={200} />
      <Skeleton variant="rounded" className={classes.container} height={200} />
    </Box>
  );
};

export default ProfileLoader;
