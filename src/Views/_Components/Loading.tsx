import { Box, CircularProgress } from "@mui/material"

interface Props {
  text: string
}

function Loading(props: Props) {
  return (
    <Box sx={{ m: 2 }} style={{ textAlign: "center" }}>
      <>
        <CircularProgress />
        <br />
        {props.text.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </>
    </Box>
  )
}
export default Loading
