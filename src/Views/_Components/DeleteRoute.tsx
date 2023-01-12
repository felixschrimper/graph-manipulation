import { Delete } from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { deleteRoute } from "../../State/Routes"
import { AppDispatch } from "../../State/_Store"

interface Props {
  routeId: string
}

function DeleteRoute(props: Props) {
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Delete fontSize="large" color="error" />
      </IconButton>
      <Dialog open={open} keepMounted onClose={(e) => setOpen(false)}>
        <DialogTitle>{"Delete route"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to delete this route?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setOpen(false)}>Cancel</Button>
          <Link to={"/"}>
            <Button
              onClick={(e) => {
                setOpen(false)
                dispatch(deleteRoute(props.routeId))
              }}
              color="error"
            >
              Delete
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteRoute
