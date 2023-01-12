import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Constants } from "../General/Constants"
import { Shapes } from "../Models/Shapes"
import { client } from "../Service/Client"
import { LoadingStatus } from "../Service/LoadingStatus"

// Define the initial state using that type
const initialState: { status: LoadingStatus; shapes: Shapes } = {
  status: LoadingStatus.idle,
  shapes: { type: "", features: [] },
}

export const fetchShapes = createAsyncThunk(
  "shapes/fetchShapes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await client.get(Constants.api + "shapes")
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e)
    }
  },
)

export const updateShapes = createAsyncThunk("shapes/shapes", async (routeId: string) => {
  try {
    const response = await client.get(
      Constants.api +
        "shapes?" +
        new URLSearchParams({
          routeId: routeId,
        }),
    )
    return response.data
  } catch (e) {
    console.log(e)
  }
})

export const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchShapes.pending, (state, action) => {
        state.status = LoadingStatus.loading
      })
      .addCase(fetchShapes.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        state.shapes = action.payload.shapes
      })
      .addCase(fetchShapes.rejected, (state, action) => {
        state.status = LoadingStatus.failed
      })
      .addCase(updateShapes.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        const newShapes = state.shapes.features.filter(
          (feature) => feature.properties.route_id !== action.meta.arg,
        )

        state.shapes.features = [...newShapes, ...action.payload.shapes.features]
      })
  },
})

export default shapesSlice.reducer
