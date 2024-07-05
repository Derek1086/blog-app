import Typography from "@mui/material/Typography";

const BodyText = ({ text, variant, color, textalign }) => {
  return (
    <Typography variant={variant} sx={{ color: color, textAlign: textalign }}>
      {text}
    </Typography>
  );
};

export default BodyText;
