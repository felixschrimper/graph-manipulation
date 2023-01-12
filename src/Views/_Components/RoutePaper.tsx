import { Paper } from "@mui/material"
import { Link } from "react-router-dom"

interface Props {
  id: string
  text: string
  color: string
  textColor: string
}

function RoutePaper(props: Props) {
  return (
    <Link to={"/route/" + props.id}>
      <Paper
        component="span"
        sx={{
          backgroundColor: "#" + (props.color ?? "000000"),
          color: "#" + (props.textColor ?? "FFFFFF"),
          fontWeight: "bold",
          padding: 1,
          display: "inline-block",
        }}
      >
        {props.text}
      </Paper>
    </Link>
  )
}
export default RoutePaper
