import Pagination from "@mui/material/Pagination";

const CustomPagination = ({ posts, postsPerPage, page, handleChange }) => {
  return (
    <>
      {posts.length > postsPerPage && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10px",
            width: "100%",
            marginTop: "20px",
            marginBottom: "100px",
          }}
        >
          <Pagination
            size="medium"
            shape="rounded"
            count={Math.ceil(posts.length / postsPerPage)}
            page={page}
            onChange={handleChange}
            sx={{
              "& .MuiPaginationItem-root": {
                marginX: 1,
              },
              "@media screen and (max-width: 768px)": {
                "& .MuiPaginationItem-root": {
                  marginX: 0,
                },
              },
            }}
          />
        </div>
      )}
    </>
  );
};

export default CustomPagination;
