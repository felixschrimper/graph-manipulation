import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Constants } from "../General/Constants"
import { Stop } from "../Models/Stops"
import { client } from "../Service/Client"
import { LoadingStatus } from "../Service/LoadingStatus"

// Define the initial state using that type
const initialState: { status: LoadingStatus; stops: Stop[] } = {
  status: LoadingStatus.idle,
  stops: [],
}

export const fetchStops = createAsyncThunk(
  "stops/fetchStops",
  async (data, { rejectWithValue }) => {
    try {
      const response = await client.get(Constants.api + "stops")
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e)
    }
  },
)

export const addStop = createAsyncThunk("stops/addStop", async (newStop: Stop) => {
  try {
    const response = await client.post(Constants.api + "stops", newStop)
    return response.data
  } catch (e) {
    console.log(e)
  }
})

function upsert(array: Stop[], element: Stop) {
  const i = array.findIndex((_element) => _element.stop_id === element.stop_id)
  if (i > -1) array[i] = element
  else array.push(element)
}

export const stopSlice = createSlice({
  name: "stops",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStops.pending, (state, action) => {
        state.status = LoadingStatus.loading
      })
      .addCase(fetchStops.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        state.stops = action.payload.stops
      })
      .addCase(fetchStops.rejected, (state, action) => {
        state.status = LoadingStatus.failed
      })
      .addCase(addStop.fulfilled, (state, action) => {
        if (action.payload.stop[0]) {
          upsert(state.stops, action.payload.stop[0])
        }
      })
  },
})

export default stopSlice.reducer
