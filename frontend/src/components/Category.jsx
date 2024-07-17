import Card from "@mui/material/Card";
import BodyText from "../ui/text/BodyText";

/**
 * Adds a category.
 * @param {string} cat - The category to add.
 * @param {Array} cats - The current list of categories.
 * @param {Function} setCat - Function to set the category input value.
 * @param {Function} setCats - Function to update the list of categories.
 * @param {Function} setError - Function to set error messages.
 */
export const addCategory = (cat, cats, setCat, setCats, setError) => {
  if (cat === "") {
    return;
  }
  if (cats.length >= 5) {
    setError({
      open: true,
      message: "Cannot add more than 5 categories",
      type: "category",
    });
    return;
  }
  if (cats.length < 5) {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
    setError({ open: false, message: "", type: "" });
  }
};

/**
 * Deletes a category.
 * @param {number} i - The index of the category to delete.
 * @param {Array} cats - The current list of categories.
 * @param {Function} setCats - Function to update the list of categories.
 */
export const deleteCategory = (i, cats, setCats) => {
  let updatedCats = [...cats];
  updatedCats.splice(i, 1);
  setCats(updatedCats);
};

const Category = ({ text }) => {
  return (
    <Card sx={{ padding: "10px" }}>
      <BodyText text={text} variant={"body2"} color={"white"} />
    </Card>
  );
};

export default Category;
