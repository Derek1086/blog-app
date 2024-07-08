import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomModal from "../ui/container/CustomModal";
import PostForm from "../components/PostForm";

/**
 * *CreatePost component for creating new posts.
 * @returns {JSX.Element} The CreatePost component.
 */
const CreatePost = () => {
  // State variables
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });
  const navigate = useNavigate();

  /**
   * Handles file change event.
   * @param {Event} event - The file change event.
   */
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  /**
   * Adds a category.
   */
  const addCategory = () => {
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
   */
  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i, 1);
    setCats(updatedCats);
  };

  /**
   * Handles aborting the creation of a post.
   */
  const handleAbort = () => {
    if (title !== "" || desc !== "" || file !== null || cats.length !== 0) {
      setOpen(true);
      return;
    }
    navigate("/");
  };

  /**
   * Handles creating a new post.
   * @param {Event} e - The form submit event.
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (title === "") {
      setError({ open: true, message: "Title cannot be empty", type: "title" });
      return;
    }
    if (file === null || filename === "") {
      setError({ open: true, message: "File cannot be empty", type: "file" });
      return;
    }
    if (desc === "") {
      setError({
        open: true,
        message: "Description cannot be empty",
        type: "desc",
      });
      return;
    }

    const post = {
      title,
      desc: desc.replace(/\n/g, "\\n"),
      username: user.username,
      userId: user._id,
      categories: cats,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("img", filename);
      data.append("file", file);
      post.photo = filename;
      // Image upload
      try {
        const imgUpload = await axios.post(URL + "/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    // Post upload
    try {
      const res = await axios.post(URL + "/api/posts/create", post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
      setError({ open: false, message: "", type: "" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title={"Are you sure you want to delete your draft?"}
        leftButtonText="Back"
        leftButtonClick={() => setOpen(false)}
        rightButtonText="Delete"
        rightButtonClick={() => navigate("/")}
      />
      <PostForm
        handleAbort={handleAbort}
        handleCreate={handleCreate}
        error={error}
        setError={setError}
        title={title}
        setTitle={setTitle}
        desc={desc}
        setDesc={setDesc}
        handleFileChange={handleFileChange}
        filename={filename}
        cat={cat}
        setCat={setCat}
        cats={cats}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        postText="Create"
      />
    </>
  );
};

export default CreatePost;
