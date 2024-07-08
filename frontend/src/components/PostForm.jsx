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
import PostContainer from "../ui/container/PostContainer";

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

const PostForm = ({
  handleAbort,
  handleCreate,
  error,
  setError,
  title,
  setTitle,
  desc,
  setDesc,
  handleFileChange,
  filename,
  cat,
  setCat,
  cats,
  addCategory,
  deleteCategory,
  postText,
}) => {
  return (
    <PostContainer>
      <Button
        color="secondary"
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<ArrowBackIcon />}
        onClick={handleAbort}
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
      <HeaderText fontsize={"22px"} text="Create Post" textalign={"left"} />
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
            {postText}
          </Button>
        </div>
      </Stack>
    </PostContainer>
  );
};

export default PostForm;
