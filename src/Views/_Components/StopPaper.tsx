import { Paper } from "@mui/material"
import { Link } from "react-router-dom"

interface Props {
  id: string
  text: string
}

function StopPaper(props: Props) {
  return (
    <Link to={"/stop/" + props.id}>
      <Paper
        component="span"
        sx={{
          backgroundColor: "yellow",
          borderColor: "green",
          border: "solid",
          color: "green",
          padding: 1,
          display: "inline-block",
        }}
      >
        {props.text}
      </Paper>
    </Link>
  )
}
export default StopPaper
