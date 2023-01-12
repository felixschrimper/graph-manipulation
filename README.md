# graph-manipulation-server

## Project setup

- Install packages:

```sh
npm install
```

- Run:

```sh
npm start
```

## Insert own Mapbox api token

- To use the software properly, a Mapbox api token is required. For more information: https://docs.mapbox.com/help/getting-started/access-tokens/.
- The token must then be inserted at

```sh
.../graph-manipulation-client/src/General/Constants.tsx line 4
```

## Change of Ports

- By default, port 5001 is used to connect the server with the web application. If this needs to be changed, there are two files to change the port.

```sh
.../graph-manipulation-client/src/General/Constants.tsx line 6
```

```sh
.../graph-manipulation-server/index.js line 10
```

- After changing the port, please restart the server and the web application.
