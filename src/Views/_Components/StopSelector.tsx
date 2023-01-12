import { Autocomplete, Box, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { Stop } from "../../Models/Stops"
import { RootState } from "../../State/_Store"
import StopPaper from "./StopPaper"

interface Props {
  stopId: string
  selectedNewStop: (stop: Stop) => void
}

function StopSelector(props: Props) {
  const stops: Stop[] = useSelector((state: RootState) => state.stops.stops)

  return (
    <Autocomplete
      options={stops}
      autoHighlight
      getOptionLabel={(stop) => stop.stop_name + " (" + stop.stop_id + ")"}
      renderOption={(props, stop) => (
        <Box component="li" m={2} key={stop.stop_id} {...props}>
          <Box sx={{ pointerEvents: "none" }}>
            <StopPaper text={stop.stop_name} id={stop.stop_id} />{" "}
            <StopPaper text={stop.stop_id} id={stop.stop_id} />
          </Box>
        </Box>
      )}
      onChange={(e, newValue) => {
        if (newValue) {
          props.selectedNewStop(newValue)
        }
      }}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Stop Id"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  )
}
export default StopSelector
