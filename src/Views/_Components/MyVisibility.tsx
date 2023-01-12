import { Visibility, VisibilityOff } from "@mui/icons-material"
import { Checkbox, FormControlLabel } from "@mui/material"

interface Props {
  shown: boolean
  visibilityAction: () => void
  visibilityOffAction: () => void
  label: React.ReactNode
}

function MyVisibility(props: Props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          onChange={(e) => {
            e.target.checked ? props.visibilityOffAction() : props.visibilityAction()
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
          icon={<VisibilityOff />}
          checkedIcon={<Visibility />}
          checked={props.shown}
        />
      }
      onClick={(e) => {
        e.stopPropagation()
      }}
      label={props.label}
    />
  )
}
export default MyVisibility
