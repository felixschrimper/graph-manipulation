import { Close } from "@mui/icons-material"
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { TripStopTime } from "../../Models/StopTimes"
import { StopPaper, TripPaper } from "../_Components/_Components"

interface Props {
  stopTimes: TripStopTime[]
  removeStop?: (stopId: string) => void
}

function TripTimetable(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {props.stopTimes.map((stopTime) => (
              <TableCell key={stopTime.trip_id}>
                <TripPaper id={stopTime.trip_id !== "" ? stopTime.trip_id : "New Trip"} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.stopTimes[0].stops.map((stop) => (
            <TableRow key={stop.stop_id}>
              <TableCell>
                <StopPaper id={stop.stop_id} text={stop.stop_sequence + ": " + stop.stop_name} />
                {props.removeStop ? (
                  <IconButton onClick={() => props.removeStop!(stop.stop_id)}>
                    <Close />
                  </IconButton>
                ) : null}
              </TableCell>
              {props.stopTimes.map((stopTime) => {
                const currentStop = stopTime.stops.find(
                  (currentStop) => currentStop.stop_id === stop.stop_id,
                )
                return (
                  <TableCell key={stopTime.trip_id + "" + stop.stop_id}>
                    {(currentStop?.arrival_time ?? "") +
                      " - " +
                      (currentStop?.departure_time ?? "")}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default TripTimetable
