import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
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

const EditPost = () => {
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

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
    }
  };

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setTitle(res.data.title);
      setDesc(res.data.desc.replace(/\\n/g, "\n"));
      setFile(res.data.photo);
      setCats(res.data.categories);
      console.log(res.data.photo);
      setFilename(res.data.photo);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdate = async (e) => {
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
      // console.log(data)
      //img upload
      try {
        const imgUpload = await axios.post(URL + "/api/upload", data);
        setError({ open: false, message: "", type: "" });
      } catch (err) {
        console.log(err);
      }
    }
    //post upload

    try {
      const res = await axios.put(URL + "/api/posts/" + postId, post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
      // console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i);
    setCats(updatedCats);
  };

  const addCategory = () => {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
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
            Are you sure you want to discard your changes??
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
              onClick={() => navigate("/posts/post/" + postId)}
              variant="contained"
              color="secondary"
              sx={{ width: "40%", padding: "10px" }}
            >
              Discard
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
          style={{ marginBottom: "20px" }}
          onClick={() => setOpen(true)}
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
        <h1 className="font-bold md:text-2xl text-xl">Update</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            id="standard-basic"
            label="Title"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            value={title}
            error={error.type === "title" && error.open === true}
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
                label="Enter post category"
                variant="standard"
                color="secondary"
                style={{ width: "100%" }}
                value={cat}
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
                    padding: "10px",
                    display: "flex",
                    gap: "10px",
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
            value={desc}
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
        </form>
      </div>
    </div>
  );
};

export default EditPost;
