import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit"
import { Constants } from "../General/Constants"
import { CalendarDate } from "../Models/CalendarDates"
import { client } from "../Service/Client"
import { LoadingStatus } from "../Service/LoadingStatus"

const initialState: { status: LoadingStatus; calendarDates: CalendarDate[] } = {
  status: LoadingStatus.idle,
  calendarDates: [],
}

async function fetchCalendarDatesRequest(rejectWithValue: any) {
  try {
    const response = await client.get(Constants.api + "calendarDates")
    return response.data
  } catch (e) {
    console.log(e)
    return rejectWithValue(e)
  }
}

export const fetchCalendarDates = createAsyncThunk(
  "calendarDates/fetchCalendarDates",
  async (data, { rejectWithValue }) => {
    return fetchCalendarDatesRequest(rejectWithValue)
  },
)

export const silentFetchCalendarDates = createAsyncThunk(
  "calendarDates/silentFetchCalendarDates",
  async (data, { rejectWithValue }) => {
    return fetchCalendarDatesRequest(rejectWithValue)
  },
)

export const addCalendarDates = createAsyncThunk(
  "calendarDates/addCalendarDates",
  async (calendarDates: { serviceId: string; newCalendarDates: CalendarDate[] }) => {
    try {
      const response = await client.post(Constants.api + "calendarDates", calendarDates)
      return response.data
    } catch (e) {
      console.log(e)
    }
  },
)

export const calendarDatesSlice = createSlice({
  name: "calendarDates",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCalendarDates.pending, (state, action) => {
        state.status = LoadingStatus.loading
      })
      .addCase(fetchCalendarDates.fulfilled, (state, action) => {
        state.status = LoadingStatus.succeeded
        state.calendarDates = action.payload.calendarDates
      })
      .addCase(fetchCalendarDates.rejected, (state, action) => {
        state.status = LoadingStatus.failed
      })
      .addCase(addCalendarDates.fulfilled, (state, action) => {
        if (action.payload.calendarDates.length > 0) {
          state.calendarDates = state.calendarDates
            .filter((calendarDate) => calendarDate.service_id !== action.meta.arg.serviceId)
            .concat(action.payload.calendarDates)
        }
      })
      .addCase(silentFetchCalendarDates.fulfilled, (state, action) => {
        state.calendarDates = action.payload.calendarDates
      })
  },
})

export default calendarDatesSlice.reducer
