import Navbar from "../components/Navbar";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { URL } from "../url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(UserContext);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [filename, setFilename] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFilename(event.target.files[0].name);
      console.log(event.target.files[0].name);
    }
  };

  const navigate = useNavigate();

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

  const handleCreate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      desc,
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
        // console.log(imgUpload.data)
      } catch (err) {
        console.log(err);
      }
    }
    //post upload
    // console.log(post)
    try {
      const res = await axios.post(URL + "/api/posts/create", post, {
        withCredentials: true,
      });
      navigate("/posts/post/" + res.data._id);
      // console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold md:text-2xl text-xl ">Create a post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            id="standard-basic"
            label="Title"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
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
            id="standard-basic"
            label="Enter post description"
            variant="standard"
            color="secondary"
            style={{ width: "100%" }}
            multiline
            minRows={15}
            cols={30}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              onClick={handleCreate}
              variant="contained"
              color="secondary"
              style={{ width: "50%", padding: "10px" }}
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
