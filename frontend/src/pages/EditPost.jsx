import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import CustomModal from "../ui/container/CustomModal";
import PostForm from "../components/PostForm";
import { addCategory, deleteCategory } from "../components/Category";

/**
 * *EditPost component for editing new posts.
 * @returns {JSX.Element} The EditPost component.
 */
const EditPost = ({ setAlert }) => {
  // State variables
  const postId = useParams().id;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [filename, setFilename] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState({
    open: false,
    message: "",
    type: "",
  });

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
   * Handles fetching the post to edit.
   */
  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      setTitle(res.data.title);
      setDesc(res.data.desc.replace(/\\n/g, "\n"));
      //setFile(res.data.photo);
      setCats(res.data.categories);
      setFilename(res.data.photo);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Handles updating a new post.
   * @param {Event} e - The form submit event.
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (title === "") {
      setError({ open: true, message: "Title cannot be empty", type: "title" });
      return;
    }
    // if (file === null || filename === "") {
    //   setError({ open: true, message: "File cannot be empty", type: "file" });
    //   return;
    // }
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
      //img upload
      try {
        const imgUpload = await axios.post(URL + "/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      const res = await axios.put(URL + "/api/posts/" + postId, post, {
        withCredentials: true,
      });
      setAlert({
        open: true,
        message: "Post updated",
        type: "post",
      });
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  return (
    <>
      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        title={`Are you sure you want to discard your changes?`}
        leftButtonText="Back"
        leftButtonClick={() => setOpen(false)}
        rightButtonText="Discard"
        rightButtonClick={() => navigate("/posts/post/" + postId)}
      />
      <PostForm
        handleAbort={() => setOpen(true)}
        handleCreate={handleUpdate}
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
        setCats={setCats}
        addCategory={addCategory}
        deleteCategory={deleteCategory}
        postText="Update"
      />
    </>
  );
};

export default EditPost;
