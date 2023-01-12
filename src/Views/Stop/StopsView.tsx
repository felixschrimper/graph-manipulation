import { ExpandMore, AddCircleOutline, DirectionsBus } from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import React, { useRef, useState } from "react"
// @ts-ignore
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { Stop } from "../../Models/Stops"
import StopDetailComponent from "./StopDetailComponent"
import { Loading, Map, MapMethods, StopPaper } from "../_Components/_Components"
import { useSelector } from "react-redux"
import { RootState } from "../../State/_Store"
import InfiniteScroll from "react-infinite-scroll-component"
import { Link } from "react-router-dom"

function StopsView() {
  const stops: Stop[] = useSelector((state: RootState) => state.stops.stops)

  const mapRef = useRef<MapMethods | null>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [expanded, setExpanded] = useState<string | false>(false)
  var currentMarker = useRef<mapboxgl.Marker | undefined>(undefined)
  const [query, setQuery] = useState<string>("")
  const [offset, setOffset] = useState<number>(20)

  function searchStops(query: string): Stop[] {
    if (query === "") {
      return stops
    }
    return stops.filter((stop) => stop.stop_name.toLowerCase().includes(query.toLowerCase()))
  }

  function showStop(
    stop: Stop,
  ): ((event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void) | undefined {
    return (e, expanded) => {
      setExpanded(expanded ? stop.stop_id : false)
      if (expanded) {
        if (currentMarker.current) {
          mapRef.current?.removeStopMarkers([currentMarker.current])
        }
        map.current.setCenter([stop.stop_lon, stop.stop_lat])

        currentMarker.current = mapRef.current?.addStopMarkers([stop])[0]
      }
    }
  }

  return (
    <>
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          <DirectionsBus fontSize="inherit" /> Stops ({stops.length})
        </Typography>
        <Link to="/addStop">
          <AddCircleOutline fontSize="large" />
        </Link>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <TextField
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            className="searchBar"
            label="Search Stops"
            variant="outlined"
          />
          <InfiniteScroll
            className="scrollableAccordion"
            height={"70vh"}
            dataLength={offset}
            next={() => setOffset(offset + 20)}
            hasMore={offset < searchStops(query).length}
            loader={<Loading text="Loading" />}
          >
            {searchStops(query)
              .slice(0, offset)
              .map((stop: Stop) => (
                <Accordion
                  key={stop.stop_id}
                  expanded={expanded === stop.stop_id}
                  onChange={showStop(stop)}
                  TransitionProps={{ unmountOnExit: true }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />} id="{line.name}">
                    <StopPaper id={stop.stop_id} text={stop.stop_name} />
                  </AccordionSummary>
                  <AccordionDetails>
                    <StopDetailComponent stop={stop} />
                  </AccordionDetails>
                </Accordion>
              ))}
          </InfiniteScroll>
        </Grid>
        <Grid item xs={4}>
          <Map map={map} ref={mapRef} />
        </Grid>
      </Grid>
    </>
  )
}

export default StopsView
