import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
   * Deletes a category.
   * @param {number} i - The index of the category to delete.
   */
  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i);
    setCats(updatedCats);
  };

  /**
   * Adds a category.
   */
  const addCategory = () => {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
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
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete your draft?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            All of your info will be lost.
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: "gray",
                width: "40%",
                padding: "10px",
              }}
              onClick={() => setOpen(false)}
            >
              Back
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="contained"
              color="secondary"
              sx={{ width: "40%", padding: "10px" }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
      <div className="px-6 md:px-[200px] mt-8">
        <Button
          color="secondary"
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<ArrowBackIcon />}
          onClick={handleAbort}
        >
          Back
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {error.open === true && (
            <h3 className="text-red-500 text-sm text-center">
              {error.message}
            </h3>
          )}
        </div>
        <h1 className="font-bold md:text-2xl text-xl mt-8">Create Post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            id="standard-basic"
            label="Title"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            error={error.type === "title" && error.open === true}
            inputProps={{ maxLength: 100 }}
          />
          <div>
            <Button
              color="secondary"
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput onChange={handleFileChange} type="file" />
            </Button>
            <TextField
              value={filename}
              variant="standard"
              color="secondary"
              fullWidth
              disabled
              sx={{ mt: 2 }}
              error={error.type === "file" && error.open === true}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-4 md:space-x-8">
              <TextField
                onChange={(e) => setCat(e.target.value)}
                id="standard-basic"
                label="Category"
                variant="standard"
                color="secondary"
                style={{ width: "100%" }}
                value={cat}
                inputProps={{ maxLength: 20 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCategory();
                  }
                }}
              />
              <Button
                onClick={addCategory}
                variant="contained"
                color="secondary"
                style={{ padding: "10px" }}
              >
                Add
              </Button>
            </div>
            {/* categories */}
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              {cats?.map((c, i) => (
                <Card
                  sx={{
                    padding: "5px",
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={i}
                >
                  {c}
                  <IconButton onClick={() => deleteCategory(i)}>
                    <CloseIcon />
                  </IconButton>
                </Card>
              ))}
            </div>
          </div>
          <TextField
            onChange={(e) => setDesc(e.target.value)}
            id="standard-basic"
            label="Description"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            multiline
            minRows={15}
            cols={30}
            error={error.type === "desc" && error.open === true}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "100px",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                backgroundColor: "gray",
                width: "30%",
                padding: "10px",
              }}
              onClick={handleAbort}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              variant="contained"
              color="secondary"
              sx={{ width: "30%", padding: "10px" }}
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
