const MainContainer = ({ children, justifyContent }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: justifyContent,
        gap: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default MainContainer;
