const MainContainer = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default MainContainer;
