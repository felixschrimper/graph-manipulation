import { TextField } from "@mui/material"

interface Props {
  label: string
  color: string
  setNewColor: (color: string) => void
}

function ColorPicker(props: Props) {
  return (
    <>
      <TextField
        onChange={(e) => {
          props.setNewColor(e.target.value)
        }}
        value={props.color}
        label={props.label}
        variant="outlined"
        sx={{ mr: 2 }}
      />
      <input
        type="color"
        value={props.color}
        onChange={(e) => props.setNewColor(e.target.value)}
        style={{ height: "100%" }}
      />
    </>
  )
}
export default ColorPicker
