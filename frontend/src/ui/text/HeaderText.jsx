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
      }}
    >
      {text}
    </p>
  );
};

export default HeaderText;
