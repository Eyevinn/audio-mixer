# Audio Mixer

Audio Mixer for Ateliere.

# Environment Variables

See file .env.local.sample for reference, and create a file named .env.local and enter your environment variables.

Useful for development, 'default' URL for modal
```
REACT_APP_WS_URL=
```

Decide whether or not debug mode should be on or not
```
REACT_APP_DEBUG_MODE=
```

Choose desired level of logging
LOGGER LEVELS
0 = no logs
1 = basic logs
2 = colored logs
3 = data logs

```
REACT_APP_DEV_LOGGER_LEVEL=
```

## Development

To start the Audio Mixer in dev mode, run:
```
npm run start
```

## Deployment

If you have docker installed on your local machine you may create a docker image and run it in a simple container.

To create a docker image tagged "audio-mixer" run:

```
docker build -t=audio-mixer .
```

To build a docker image and run it in a simple container run:

```
docker-compose up
```
