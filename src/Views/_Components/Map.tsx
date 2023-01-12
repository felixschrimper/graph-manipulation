import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { Constants } from "../../General/Constants"
import "mapbox-gl/dist/mapbox-gl.css"
// @ts-ignore
import mapboxgl from "mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import { useSelector } from "react-redux"
import { Feature, Shapes } from "../../Models/Shapes"
import { RootState } from "../../State/_Store"
import { Route } from "../../Models/Routes"
import { Stop } from "../../Models/Stops"

mapboxgl.accessToken = Constants.mapBoxAccessToken

interface Props {
  map: React.MutableRefObject<any>
}

export interface MapMethods {
  showRoute: (routeId: string) => void
  showRoutes: (routes: string[]) => string[]
  showRoutesOfType: (routeType: number) => string[]
  hideRoute: (routeId: string) => void
  hideRoutes: (routes: string[]) => string[]
  hideRoutesOfType: (routeType: number) => string[]

  addStopMarkers: (stops: Stop[], color?: string) => mapboxgl.Marker[]
  removeStopMarkers: (markers: mapboxgl.Marker[]) => void
}

export const Map = forwardRef<MapMethods, Props>((props, ref) => {
  const mapContainer = useRef(null)

  const routes: Route[] = useSelector((state: RootState) => state.routes.routes)
  const shapes: Shapes = useSelector((state: RootState) => state.shapes.shapes)

  useImperativeHandle(ref, () => ({
    showRoutesOfType: showRoutesOfType,
    showRoute: showRoute,
    showRoutes: showRoutes,
    hideRoutesOfType: hideRoutesOfType,
    hideRoute: hideRoute,
    hideRoutes: hideRoutes,
    addStopMarkers: addStopMarkers,
    removeStopMarkers: removeStopMarkers,
  }))

  useEffect(() => {
    initMap()
  }, [])

  function initMap() {
    if (props.map.current) return
    props.map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [Constants.munichCoordinates.lon, Constants.munichCoordinates.lat],
      zoom: Constants.defaultZoom,
    })
  }

  function showRoutesOfType(routeType: number): string[] {
    const filteredShapes = shapes.features.filter(
      (feature) => feature.properties.route_type === routeType,
    )
    if (filteredShapes.length >= 1000) return []

    showFeatures(filteredShapes)
    return getRouteMapIdsOfType(routeType)
  }

  function showRoute(routeId: string) {
    const filteredShapes = shapes.features.filter((feature) =>
      feature.properties.route_id.includes(routeId),
    )
    showFeatures(filteredShapes)
  }

  function showRoutes(routes: string[]): string[] {
    const filteredShapes = shapes.features.filter((feature) =>
      routes.includes(feature.properties.route_id),
    )
    if (filteredShapes.length >= 1000) return []

    showFeatures(filteredShapes)
    return routes
  }

  function showFeatures(features: Feature[]) {
    features.forEach((feature: Feature, index: number) => {
      var sourceId: string = feature.properties.route_id + index.toString()

      if (!props.map.current.getSource(sourceId)) {
        props.map.current.addSource(sourceId, {
          type: "geojson",
          data: feature,
        })
      }
      if (!props.map.current.getLayer(sourceId)) {
        props.map.current.addLayer({
          id: sourceId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": feature.properties.route_color ?? "#000000",
            "line-width": 4,
          },
        })
      }
    })
  }

  function hideRoutesOfType(routeType: number): string[] {
    return getRouteMapIdsOfType(routeType).map((id) => {
      hideRoute(id)
      return id
    })
  }

  function hideRoute(routeId: string) {
    var layers = props.map.current.getStyle().layers
    layers
      .filter((layer: any) => layer.id.includes(routeId))
      .forEach((layer: any) => props.map.current.removeLayer(layer.id))
  }

  function hideRoutes(routes: string[]): string[] {
    return routes.map((id) => {
      hideRoute(id)
      return id
    })
  }

  function getRouteMapIdsOfType(type: number): string[] {
    return Array.from(
      new Set(
        routes
          .filter((routes) => routes.route_type === type)
          .map((routes) => routes.route_id ?? ""),
      ),
    )
  }

  function addStopMarkers(stops: Stop[], color: string = "#3f50b5"): mapboxgl.Marker[] {
    var newMarkers: mapboxgl.Marker[] = []
    stops.forEach((stop) => {
      const popup = new mapboxgl.Popup({ offset: 20 }).setText(stop.stop_name)

      const el = document.createElement("div")
      el.className = "marker"
      el.style.backgroundColor = "#" + color
      const newMarker: mapboxgl.Marker = new mapboxgl.Marker(el)
        .setLngLat([stop.stop_lon, stop.stop_lat])
        .setPopup(popup)
        .addTo(props.map.current)
      newMarkers.push(newMarker)
    })
    return newMarkers
  }

  function removeStopMarkers(markers: mapboxgl.Marker[]) {
    markers.forEach((marker) => {
      marker.remove()
    })
  }

  return <div ref={mapContainer} className="map-container" />
})
