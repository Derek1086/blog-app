const HeaderText = ({ fontsize, text, textalign }) => {
  return (
    <p
      style={{
        fontSize: fontsize,
        fontWeight: "bold",
        width: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textAlign: textalign,
        marginTop: "10px",
      }}
    >
      {text}
    </p>
  );
};

export default HeaderText;
