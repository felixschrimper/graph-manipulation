import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Constants } from "../General/Constants"
import { Calendar } from "../Models/Calendars"
import { client } from "../Service/Client"
import { LoadingStatus } from "../Service/LoadingStatus"

const initialState: { status: LoadingStatus; calendars: Calendar[] } = {
  status: LoadingStatus.idle,
  calendars: [],
}

async function fetchCalendarsRequest(rejectWithValue: any) {
  try {
    const response = await client.get(Constants.api + "calendars")
    return response.data
  } catch (e) {
    console.log(e)
    return rejectWithValue(e)
  }
}

export const fetchCalendars = createAsyncThunk(
  "calendars/fetchCalendars",
  async (data, { rejectWithValue }) => {
    return fetchCalendarsRequest(rejectWithValue)
  },
)

export const silentFetchCalendars = createAsyncThunk(
  "calendars/silentFetchCalendars",
  async (data, { rejectWithValue }) => {
    return fetchCalendarsRequest(rejectWithValue)
  },
)

export const addCalendar = createAsyncThunk(
  "calendar/addCalendar",
  async (newCalendar: Calendar) => {
    try {
      const response = await client.post(Constants.api + "calendars", newCalendar)
      return response.data
    } catch (e) {
      console.log(e)
    }
  },
)

function upsert(array: Calendar[], element: Calendar) {
  const i = array.findIndex((_element) => _element.service_id === element.service_id)
  if (i > -1) array[i] = element
  else array.push(element)
}

export const calendarSlice = createSlice({
  name: "calendars",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCalendars.pending, (state, action) => {
        state.status = LoadingStatus.loading
      })
      .addCase(fetchCalendars.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        state.calendars = action.payload.calendars
      })
      .addCase(fetchCalendars.rejected, (state, action) => {
        state.status = LoadingStatus.failed
      })
      .addCase(addCalendar.fulfilled, (state, action) => {
        if (action.payload.calendars[0]) {
          upsert(state.calendars, action.payload.calendars[0])
        }
      })
      .addCase(silentFetchCalendars.fulfilled, (state, action) => {
        state.calendars = action.payload.calendars
      })
  },
})

export default calendarSlice.reducer
