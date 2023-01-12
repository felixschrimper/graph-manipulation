import { Autocomplete, Box, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import RoutePaper from "./RoutePaper"

interface Props {
  routeId: string
  selectedNewRoute: (routeId: string) => void
}

function TripPaper(props: Props) {
  const routes = useSelector((state: RootState) => state.routes.routes)

  return (
    <Autocomplete
      options={routes}
      autoHighlight
      getOptionLabel={(route) => route.route_short_name + " (" + route.route_id + ")"}
      renderOption={(props, route) => (
        <Box component="li" m={2} key={route.route_id} {...props}>
          <Box sx={{ pointerEvents: "none" }}>
            <RoutePaper
              text={route.route_short_name}
              id={route.route_id}
              color={route.route_color}
              textColor={route.route_text_color}
            />{" "}
            <RoutePaper
              text={route.route_id}
              id={route.route_id}
              color={route.route_color}
              textColor={route.route_text_color}
            />
          </Box>
        </Box>
      )}
      onChange={(e, newValue) => {
        if (newValue?.route_id) {
          props.selectedNewRoute(newValue.route_id)
        }
      }}
      value={routes.find((route) => route.route_id === props.routeId)}
      sx={{ width: "100%" }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Route Id"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  )
}
export default TripPaper
