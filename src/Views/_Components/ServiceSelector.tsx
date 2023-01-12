import { Autocomplete, Box, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { Calendar } from "../../Models/Calendars"
import { RootState } from "../../State/_Store"

interface Props {
  service: Calendar
  selectedNewService: (stop: Calendar) => void
}

function ServiceSelector(props: Props) {
  const calendars = useSelector((state: RootState) => state.calendars.calendars)

  return (
    <Autocomplete
      options={calendars}
      autoHighlight
      getOptionLabel={(calendar) => calendar.service_id}
      renderOption={(props, calendar) => (
        <Box component="li" m={2} {...props}>
          <Box sx={{ pointerEvents: "none" }}>{calendar.service_id}</Box>
        </Box>
      )}
      onChange={(e, newValue) => {
        if (newValue) {
          props.selectedNewService(newValue)
        }
      }}
      value={props.service}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Calendar Id"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  )
}
export default ServiceSelector
