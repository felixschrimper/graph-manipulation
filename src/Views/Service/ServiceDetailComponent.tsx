import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { AppDispatch, RootState } from "../../State/_Store"
import { useDispatch, useSelector } from "react-redux"
import { Calendar, encodeServiceIdUrl } from "../../Models/Calendars"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarDate, dateToNumber, numberToDate } from "../../Models/CalendarDates"
import { CalendarDatePaper, ServiceSelector } from "../_Components/_Components"
import { LoadingStatus } from "../../Service/LoadingStatus"
import { addCalendar } from "../../State/Calendars"
import { addCalendarDates } from "../../State/CalendarDates"
import AddExceptionDateComponent from "./AddExceptionDateComponent"

export enum CalendarMode {
  showCalendar,
  useCalendar,
  editCalendar,
}

interface Props {
  service_id: string
  mode: CalendarMode
}

export interface ServiceMethods {
  getCalendar: () => { calendar: Calendar; calendarDates: CalendarDate[] }
}

export const ServiceDetailComponent = forwardRef<ServiceMethods, Props>((props, ref) => {
  useImperativeHandle(ref, () => ({
    getCalendar: getCalendar,
  }))

  var [service_id, setService_id] = useState<string>(props.service_id)
  var [custom, setCustom] = useState<boolean>(
    props.mode === CalendarMode.editCalendar ? true : false,
  )

  const dispatch = useDispatch<AppDispatch>()

  function getCalendar(): {
    calendar: Calendar
    calendarDates: CalendarDate[]
  } {
    return { calendar, calendarDates }
  }

  const rawCalendar: Calendar | undefined = useSelector((state: RootState) =>
    state.calendars.calendars.find((calendar) => calendar.service_id === service_id),
  )

  const [calendar, setCalendar] = useState<Calendar>(
    rawCalendar ?? {
      service_id: "",
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      start_date: 20220615,
      end_date: 20221215,
    },
  )

  const rawCalendarDates: CalendarDate[] = useSelector((state: RootState) =>
    state.calendarDates.calendarDates.filter(
      (calendarDate) => calendarDate.service_id === service_id,
    ),
  )

  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>(rawCalendarDates)

  useEffect(() => {
    if (custom && props.mode !== CalendarMode.editCalendar) {
      setService_id("")
      setCalendar({ ...calendar, service_id: "" })
      setCalendarDates(calendarDates.map((date) => ({ ...date, service_id: "" })))
    }
  }, [custom])

  const [updateCalendarState, setUpdateCalendarState] = useState<LoadingStatus>(LoadingStatus.idle)
  async function updateCalendar() {
    setUpdateCalendarState(LoadingStatus.loading)

    try {
      await dispatch(addCalendar(calendar))
      await dispatch(addCalendarDates({ serviceId: service_id, newCalendarDates: calendarDates }))
      setUpdateCalendarState(LoadingStatus.succeeded)
    } catch (e) {
      setUpdateCalendarState(LoadingStatus.failed)
      console.log(e)
    }
  }

  function DayCheckbox(label: string, value: number, varLabel: string) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              setCalendar({
                ...calendar,
                [varLabel]: e.target.checked ? 1 : 0,
              })
            }}
            checked={value === 1}
            disabled={props.mode === CalendarMode.showCalendar || !custom}
          />
        }
        label={label}
      />
    )
  }

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            {props.mode === CalendarMode.useCalendar ? (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch checked={custom} onChange={(e) => setCustom(e.target.checked)} />
                  }
                  label="Custom Calendar"
                />
              </Grid>
            ) : null}
            {(props.mode === CalendarMode.editCalendar ||
              props.mode === CalendarMode.useCalendar) &&
            !custom ? (
              <Grid item xs={12}>
                <ServiceSelector
                  selectedNewService={(service) => {
                    setService_id(service.service_id)
                    setCalendar(service)
                    setCalendarDates(rawCalendarDates)
                  }}
                  service={calendar}
                  key={"ServiceSelector" + calendar.service_id}
                />
              </Grid>
            ) : null}
            {props.mode === CalendarMode.showCalendar ? (
              <Grid item xs={12}>
                <Typography>
                  Service Id:
                  <Link to={"/calendar/" + encodeServiceIdUrl(service_id)}>
                    <b> {service_id}</b>
                  </Link>
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        const on = e.target.checked ? 1 : 0
                        setCalendar({
                          ...calendar,
                          monday: on,
                          tuesday: on,
                          wednesday: on,
                          thursday: on,
                          friday: on,
                        })
                      }}
                      checked={
                        calendar?.monday === 1 &&
                        calendar?.tuesday === 1 &&
                        calendar?.wednesday === 1 &&
                        calendar?.thursday === 1 &&
                        calendar?.friday === 1
                      }
                      disabled={props.mode === CalendarMode.showCalendar || !custom}
                    />
                  }
                  label="Weekdays"
                />
                {DayCheckbox("Monday", calendar?.monday, "monday")}
                {DayCheckbox("Tuesday", calendar?.tuesday, "tuesday")}
                {DayCheckbox("Wednesday", calendar?.wednesday, "wednesday")}
                {DayCheckbox("Thursday", calendar?.thursday, "thursday")}
                {DayCheckbox("Friday", calendar?.friday, "friday")}
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) => {
                        const on = e.target.checked ? 1 : 0
                        setCalendar({ ...calendar, saturday: on, sunday: on })
                      }}
                      checked={calendar?.saturday === 1 && calendar.sunday === 1}
                      disabled={props.mode === CalendarMode.showCalendar || !custom}
                    />
                  }
                  label="Weekend"
                />
                {DayCheckbox("Saturday", calendar?.saturday, "saturday")}
                {DayCheckbox("Sunday", calendar?.sunday, "sunday")}
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <TextField
                onChange={(e) => {
                  setCalendar({
                    ...calendar,
                    start_date: dateToNumber(e.target.value),
                  })
                }}
                value={numberToDate(calendar?.start_date)}
                className="searchBar"
                label="Start date"
                variant="outlined"
                type="date"
                disabled={props.mode === CalendarMode.showCalendar || !custom}
                error={calendar.start_date > calendar.end_date}
              />
              <TextField
                sx={{ mt: 2 }}
                onChange={(e) => {
                  setCalendar({
                    ...calendar,
                    end_date: dateToNumber(e.target.value),
                  })
                }}
                value={numberToDate(calendar?.end_date)}
                className="searchBar"
                label="End date"
                variant="outlined"
                type="date"
                disabled={props.mode === CalendarMode.showCalendar || !custom}
                error={calendar.start_date > calendar.end_date}
                helperText={
                  calendar.start_date > calendar.end_date
                    ? "End date must be after start date."
                    : ""
                }
              />
            </Grid>
            {calendarDates.length > 0 ? (
              <Grid item xs={12}>
                {calendarDates
                  .sort((a, b) => a.date - b.date)
                  .map((calendarDate: CalendarDate) => {
                    return (
                      <CalendarDatePaper
                        calendarDate={calendarDate}
                        removeCalendarDate={(date) =>
                          setCalendarDates(
                            calendarDates.filter((date) => date.id !== calendarDate.id),
                          )
                        }
                        custom={custom}
                      />
                    )
                  })}
              </Grid>
            ) : null}
            {custom ? (
              <AddExceptionDateComponent
                service_id={service_id}
                addNewDate={(newDate) => setCalendarDates([...calendarDates, newDate])}
              />
            ) : null}
          </Grid>
        </CardContent>
      </Card>
      {props.mode === CalendarMode.editCalendar ? (
        <Grid item xs={12} mt={2}>
          <Button
            onClick={(e) => {
              e.currentTarget.disabled = true
              updateCalendar()
            }}
            variant="contained"
          >
            {updateCalendarState.toString() === "Idle"
              ? "Update Calendar"
              : updateCalendarState.toString()}
          </Button>
          <Link to={"/calendar/" + encodeServiceIdUrl(service_id)}>
            <Button>
              {updateCalendarState === LoadingStatus.succeeded ? "Back to Calendar" : "Cancel"}
            </Button>
          </Link>
        </Grid>
      ) : null}
    </>
  )
})
