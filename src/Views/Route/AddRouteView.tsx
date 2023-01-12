import { Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Route } from "../../Models/Routes"
import { ColorPicker, MyAlert, RoutePaper } from "../_Components/_Components"
import { addRoute } from "../../State/Routes"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../State/_Store"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { Link, useParams } from "react-router-dom"
import { Add, Edit } from "@mui/icons-material"
import { Constants } from "../../General/Constants"

enum Mode {
  addRoute,
  editRoute,
}

function AddRouteView() {
  let { routeId } = useParams()
  const mode: Mode = routeId ? Mode.editRoute : Mode.addRoute

  const dispatch = useDispatch<AppDispatch>()

  const route: Route | undefined = useSelector((state: RootState) =>
    state.routes.routes.find((route) => route.route_id === routeId),
  )

  const [newRoute, setNewRoute] = useState<Route>(
    route
      ? {
          ...route,
          route_color: "#" + (route.route_color ?? "000000"),
          route_text_color: "#" + (route.route_text_color ?? "FFFFFF"),
          start_date: 0,
          end_date: 0,
        }
      : {
          route_id: "",
          route_short_name: "",
          route_long_name: "",
          route_type: 0,
          route_color: "#000000",
          route_text_color: "#FFFFFF",
          start_date: 0,
          end_date: 0,
        },
  )

  const [showError, setShowError] = useState<boolean>(false)
  const [addRouteStatus, setAddRouteStatus] = useState<LoadingStatus>(LoadingStatus.idle)

  function canSave(): boolean {
    if (newRoute.route_short_name && newRoute.route_long_name) {
      return true
    }
    setShowError(true)
    return false
  }

  async function saveRoute() {
    const saveNewRoute = {
      ...newRoute,
      route_color: newRoute.route_color.replace("#", ""),
      route_text_color: newRoute.route_text_color.replace("#", ""),
    }

    try {
      setAddRouteStatus(LoadingStatus.loading)
      const result = await dispatch(addRoute(saveNewRoute)).unwrap()
      setCreatedRoute(result.route[0])
    } catch (e) {
      setAddRouteStatus(LoadingStatus.failed)
    } finally {
      setAddRouteStatus(LoadingStatus.succeeded)
    }
  }

  const [createdRoute, setCreatedRoute] = useState<Route | undefined>(undefined)

  return (
    <>
      <MyAlert
        showAlert={showError}
        setShowAlert={setShowError}
        message="Please fill out all fields."
        severity="error"
      />
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          {mode === Mode.addRoute ? <Add fontSize="inherit" /> : <Edit fontSize="inherit" />}
          {mode === Mode.addRoute ? "Add Route" : "Edit Route"}
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        {newRoute.route_id ? (
          <Grid item xs={12}>
            <RoutePaper
              text={newRoute.route_id}
              id={newRoute.route_id}
              color={newRoute.route_color.replace("#", "")}
              textColor={newRoute.route_text_color.replace("#", "")}
            />
          </Grid>
        ) : null}
        <Grid item xs={4}>
          <TextField
            onChange={(e) => {
              setNewRoute({ ...newRoute, route_short_name: e.target.value })
            }}
            value={newRoute.route_short_name}
            className="searchBar"
            label="Short name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            onChange={(e) => {
              setNewRoute({ ...newRoute, route_long_name: e.target.value })
            }}
            value={newRoute.route_long_name}
            className="searchBar"
            label="Long name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={4}>
          <Select
            value={newRoute.route_type}
            onChange={(e) => {
              const value = e.target.value as number
              setNewRoute({ ...newRoute, route_type: value })
            }}
            label="Type"
            style={{ width: "50%" }}
          >
            {Constants.vehicleTypes.map((type) => {
              return (
                <MenuItem value={type.route_type} key={type.name}>
                  {type.name}
                </MenuItem>
              )
            })}
          </Select>
        </Grid>
        <Grid item xs={4}>
          <ColorPicker
            label="Route Color"
            color={newRoute.route_color}
            setNewColor={(color) => setNewRoute({ ...newRoute, route_color: color })}
          />
        </Grid>
        <Grid item xs={4}>
          <ColorPicker
            label="Route Text Color"
            color={newRoute.route_text_color}
            setNewColor={(color) => setNewRoute({ ...newRoute, route_text_color: color })}
          />
        </Grid>
        <Grid item>
          <Button
            onClick={(e) => {
              if (canSave()) {
                saveRoute()
                e.currentTarget.disabled = true
              }
            }}
            variant="contained"
          >
            {addRouteStatus.toString() === "Idle" ? "Save Route" : addRouteStatus.toString()}
          </Button>
          {addRouteStatus === LoadingStatus.succeeded ? (
            <Link to={"/route/" + createdRoute?.route_id}>
              <Button>See new Route</Button>
            </Link>
          ) : null}
          <Link to="/">
            <Button>
              {addRouteStatus === LoadingStatus.succeeded ? "Back to Routes" : "Cancel"}
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  )
}

export default AddRouteView
