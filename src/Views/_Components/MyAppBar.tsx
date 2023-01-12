import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import Logo from "../../Assets/logo.png"
import { Avatar } from "@mui/material"
import { Link } from "react-router-dom"

export default function MyAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }} src={Logo} alt="Logo" />
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            <Link className="link" to="/">
              Graph Manipulation
            </Link>
          </Typography>
          <Link className="link" to="/routes">
            <Button color="inherit">Routes</Button>
          </Link>
          <Link className="link" to="/stops">
            <Button color="inherit">Stops</Button>
          </Link>
          <Link className="link" to="/settings">
            <Button color="inherit">Settings</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
