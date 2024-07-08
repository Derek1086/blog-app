import Card from "@mui/material/Card";
import BodyText from "../ui/text/BodyText";

const Category = ({ text }) => {
  return (
    <Card sx={{ padding: "10px", mt: 1 }}>
      <BodyText text={text} variant={"body2"} color={"white"} />
    </Card>
  );
};

export default Category;
