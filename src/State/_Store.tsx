import { configureStore } from "@reduxjs/toolkit"
import calendarDatesReducer from "./CalendarDates"
import calendarsReducer from "./Calendars"
import routesReducer from "./Routes"
import shapesReducer from "./Shapes"
import stopsReducer from "./Stops"

export const store = configureStore({
  reducer: {
    calendarDates: calendarDatesReducer,
    calendars: calendarsReducer,
    routes: routesReducer,
    shapes: shapesReducer,
    stops: stopsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
