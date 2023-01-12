import { Paper } from "@mui/material"
import { Link } from "react-router-dom"

interface Props {
  id: string
}

function TripPaper(props: Props) {
  return (
    <Link to={"/trip/" + props.id}>
      <Paper
        component="span"
        sx={{
          border: "black solid ",
          mb: 1,
          padding: 0.5,
          display: "inline-block",
        }}
      >
        {props.id}
      </Paper>
    </Link>
  )
}
export default TripPaper
