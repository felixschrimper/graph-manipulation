import { Alert, AlertColor, IconButton, Snackbar } from "@mui/material"
import { Close } from "@mui/icons-material"

interface Props {
  showAlert: boolean
  setShowAlert: (value: boolean) => void
  message: string
  severity: AlertColor | undefined
}

function MyAlert(props: Props) {
  return props.showAlert ? (
    <Snackbar
      open={props.showAlert}
      autoHideDuration={3000}
      onClose={() => props.setShowAlert(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        sx={{ m: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              props.setShowAlert(false)
            }}
          >
            <Close fontSize="inherit" />
          </IconButton>
        }
        severity={props.severity}
      >
        {props.message}
      </Alert>
    </Snackbar>
  ) : null
}
export default MyAlert
