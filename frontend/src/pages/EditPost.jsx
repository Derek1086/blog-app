import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import CustomTextField from "../ui/input/CustomTextField";
import HeaderText from "../ui/text/HeaderText";
import BodyText from "../ui/text/BodyText";
import CustomModal from "../ui/container/CustomModal";

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

/**
 * *EditPost component for editing new posts.
 * @returns {JSX.Element} The EditPost component.
 */
const EditPost = () => {
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
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

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

  return (
    <div>
      <CustomModal
        open={open}
        onclose={() => setOpen(false)}
        title={`Are you sure you want to discard your changes?`}
        leftbuttontext="Back"
        leftbuttonclick={() => setOpen(false)}
        rightbuttontext="Discard"
        rightbuttonclick={() => navigate("/posts/post/" + postId)}
      />
      <div className="px-6 md:px-[200px] mt-8">
        <Button
          color="secondary"
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<ArrowBackIcon />}
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {error.open === true && (
            <BodyText
              text={error.message}
              variant={"body2"}
              color={"red"}
              textalign={"center"}
            />
          )}
        </div>
        <HeaderText fontsize={"22px"} text="Update Post" textalign={"left"} />
        <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
          <CustomTextField
            label="Title"
            id={"title"}
            onChange={(e) => {
              setTitle(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={title}
            error={error.type === "title" && error.open === true}
            autoFocus={true}
            password={false}
            showPassword={null}
            enterFunction={null}
            handleClick={null}
            handleShow={null}
            maxLength={50}
          />
          <div>
            <div style={{ marginBottom: "10px" }}>
              <BodyText
                text={"Filename"}
                variant={"body2"}
                color={"text.secondary"}
                textalign={"left"}
              />
            </div>
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
              variant="outlined"
              color="secondary"
              fullWidth
              disabled
              sx={{ mt: 2 }}
              error={error.type === "file" && error.open === true}
            />
          </div>
          <CustomTextField
            label="Category"
            id={"category"}
            onChange={(e) => {
              setCat(e.target.value);
              setError({ open: false, message: "", type: "" });
            }}
            value={cat}
            error={error.type === "category" && error.open === true}
            autoFocus={false}
            password={false}
            showPassword={null}
            enterFunction={(e) => {
              if (e.key === "Enter") {
                addCategory();
              }
            }}
            handleClick={null}
            handleShow={null}
            maxLength={20}
          />
          <div>
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
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
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
          <BodyText
            text={"Description"}
            variant={"body2"}
            color={"text.secondary"}
            textalign={"left"}
          />
          <TextField
            id={"description"}
            label=""
            variant="outlined"
            color="secondary"
            sx={{ width: "100%" }}
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            error={error.type === "desc" && error.open === true}
            multiline
            minRows={15}
            cols={30}
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
              onClick={() => setOpen(true)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              color="secondary"
              sx={{ width: "30%", padding: "10px" }}
            >
              Update
            </Button>
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default EditPost;
