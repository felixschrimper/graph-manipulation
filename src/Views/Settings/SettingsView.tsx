import { Settings } from "@mui/icons-material"
import { Box, Button, Grid, Link, List, ListItem, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { Constants } from "../../General/Constants"
import { client } from "../../Service/Client"

function SettingsView() {
  console.log("Settings")

  const [fetchStatus, setFetchStatus] = useState<String>("")
  const [exportStatus, setExportStatus] = useState<String>("")

  const [fetchUrl, setFetchUrl] = useState<String>("https://www.mvg.de/static/gtfs/gtfs-mvg.zip")

  const fetchGTFS = async () => {
    setFetchStatus("Fetching...")
    try {
      const response = await client.post(Constants.api + "gtfs/fetch", { url: fetchUrl })
      console.log(response.data)
      setFetchStatus("Successfully fetched")
    } catch (e) {
      console.log(e)
      setFetchStatus("Error fetching...")
    }
  }

  const exportGTFS = async () => {
    setExportStatus("Exporting...")
    try {
      const response = await client.get(Constants.api + "gtfs/export")
      console.log(response.data)
      setExportStatus("Successfully exported")
    } catch (e) {
      console.log(e)
      setExportStatus("Error exporting...")
    }
  }

  const files = [
    "agency.txt",
    "routes.txt",
    "stops.txt",
    "calendar.txt",
    "shapes.txt",
    "transfers.txt",
    "calendar_dates.txt",
    "stop_times.txt",
    "trips.txt",
  ]

  return (
    <Box sx={{ flexDirection: "column", display: "flex" }}>
      <Grid container className="headlineContainer">
        <Typography variant="h3" className="iconTypography">
          <Settings fontSize="inherit" />
          Settings
        </Typography>
      </Grid>
      <TextField
        sx={{ marginBottom: 3 }}
        id="outlined-basic"
        label="GTFS URL"
        variant="outlined"
        value={fetchUrl}
        onChange={(e) => {
          setFetchUrl(e.target.value)
        }}
      />
      <Button variant="contained" onClick={fetchGTFS} sx={{ mb: 3 }}>
        Import GTFS
      </Button>
      <Button variant="contained" onClick={exportGTFS} sx={{ mb: 3 }}>
        Export GTFS
      </Button>
      <Box>{fetchStatus}</Box>
      <Box>{exportStatus}</Box>
      <Box>
        <List>
          {files.map((file) => (
            <ListItem key={file}>
              <Link href={Constants.api + "gtfs-export/" + file} target="_blank">
                {file}
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default SettingsView
