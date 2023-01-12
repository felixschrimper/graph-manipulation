import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Constants } from "../General/Constants"
import { formRouteDataForMap, Route } from "../Models/Routes"
import { client } from "../Service/Client"
import { LoadingStatus } from "../Service/LoadingStatus"

const initialState: { status: LoadingStatus; routes: Route[]; routesForMap: Route[][] } = {
  status: LoadingStatus.idle,
  routes: [],
  routesForMap: [],
}

export const fetchRoutes = createAsyncThunk(
  "routes/fetchRoutes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await client.get(Constants.api + "routes")
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e)
    }
  },
)

export const addRoute = createAsyncThunk("routes/addRoute", async (newRoute: Route) => {
  try {
    const response = await client.post(Constants.api + "routes", newRoute)
    return response.data
  } catch (e) {
    console.log(e)
  }
})

export const deleteRoute = createAsyncThunk("routes/deleteRoute", async (routeId: string) => {
  try {
    await client.delete(Constants.api + "routes", { routeId: routeId })
  } catch (e) {
    console.log(e)
  }
})

function upsert(array: Route[], element: Route) {
  const i = array.findIndex((_element) => _element.route_id === element.route_id)
  if (i > -1) array[i] = element
  else array.push(element)
}

export const routeSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchRoutes.pending, (state, action) => {
        state.status = LoadingStatus.loading
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        state.routes = action.payload.routes
        state.routesForMap = formRouteDataForMap(state.routes)
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.status = LoadingStatus.failed
      })
      .addCase(addRoute.fulfilled, (state, action) => {
        if (action.payload.route[0]) {
          upsert(state.routes, action.payload.route[0])
        }
        state.routesForMap = formRouteDataForMap(state.routes)
      })
      .addCase(deleteRoute.fulfilled, (state, action) => {
        state.routes = state.routes.filter((route) => route.route_id !== action.meta.arg)
        state.routesForMap = formRouteDataForMap(state.routes)
      })
  },
})

export default routeSlice.reducer
