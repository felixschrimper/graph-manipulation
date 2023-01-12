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
import { Constants } from "../../General/Constants"
import { TripStopTime } from "../../Models/StopTimes"
import { client } from "../../Service/Client"
import { updateShapes } from "../../State/Shapes"
import { AppDispatch } from "../../State/_Store"

interface Props {
  trips: TripStopTime[]
  deleteTrips: (trips: TripStopTime[]) => void
}

function DeleteTrips(props: Props) {
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  async function deleteTrips() {
    try {
      await client.delete(
        Constants.api + "trips",
        props.trips.map((sT) => sT.trip_id),
      )
      dispatch(updateShapes(props.trips[0].route_id))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <Delete fontSize="large" color="error" />
      </IconButton>
      <Dialog open={open} keepMounted onClose={(e) => setOpen(false)}>
        <DialogTitle>{"Delete trips"}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to delete the trips?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(e) => setOpen(false)}>Cancel</Button>
          <Link to={"/route/" + props.trips[0]?.route_id}>
            <Button
              onClick={(e) => {
                setOpen(false)
                deleteTrips()
                props.deleteTrips(props.trips)
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

export default DeleteTrips
