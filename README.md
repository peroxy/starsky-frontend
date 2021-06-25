# Starsky frontend :star:

Starsky frontend represents the website of the starsky application for employee scheduling.
It uses React, Node.js and TypeScript.

Backend Java REST API is located in a repository called [starsky-backend](https://github.com/peroxy/starsky-backend).

## Requirements :clipboard:

- [docker](https://docs.docker.com/get-docker/)
- [docker-compose](https://docs.docker.com/compose/install/) (at least 3.8 version support)
- (optionally for debugging) [nodejs](https://nodejs.org/en/download/) (v14.15.5 or higher)

## Development :computer:

### Running with docker :whale2:

Please note that this has only been tested with docker on Ubuntu 20.04.

1. Download frontend source files and go to `docker` directory:

```shell script
git clone https://github.com/peroxy/starsky-frontend.git
cd starsky-frontend/docker
```

2. Build and run the entire stack with `docker-compose`:

```shell script
docker-compose up
```

3. You will now be able to access:

- Frontend application at http://localhost:3000/,
- API at http://localhost:8080/ and swagger-ui at http://localhost:8080/api/swagger-ui.html,
- database at http://localhost:5432/.

The `docker-compose.override.yml` file is used for development configuration. It will bind your local `starsky-frontend` folder as a docker volume to enable live-reload.

### Debugging
You can run and debug the frontend locally using your favorite JavaScript IDE:
1. Run the backend REST API and database:

```shell script
cd starsky-backend/docker
docker-compose up database api
```
2. Run (`npm run start`) and debug the application with your IDE.

### Testing
TODO :bangbang:

### OpenAPI client
We are using the [OpenAPI client generator](https://github.com/OpenAPITools/openapi-generator) library with [typescript-fetch generator](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/typescript-fetch.md).
TypeScript code files (using `fetch`) will be output to `src/api/__generated__` folder.

To generate/update the client you can use the npm script specified inside `packages.json`:

```shell
npm run generate-api-client
```

## Deployment :rocket:

We host entire infrastructure on Azure, specifically using Azure Virtual Machine.

Please see [server requirements](https://github.com/peroxy/starsky-backend#server-requirements) section from starsky-backend for more information.

### Repository secrets

These are the required secrets that should be stored inside Github repository secrets:

- Dockerhub:
    - `DOCKERHUB_USERNAME`
    - `DOCKERHUB_TOKEN` - see [Create an access token](https://docs.docker.com/docker-hub/access-tokens/#create-an-access-token) for more information
- Server host (Azure VM):
    - `REMOTE_HOST` - remote host IP address / domain to SSH into
    - `REMOTE_USER` - username to SSH with
    - `SERVER_SSH_KEY` - private SSH key (OpenSSH, for example the contents of your `~/.ssh/id_rsa` key) to connect to your server
- Frontend:
    - `REACT_APP_BACKEND_HOST` - backend REST API base url (e.g. https://example.com/api)

### How to deploy

Push a tag `*.*.*` (e.g. `1.0.3`) to `master` branch and it will automatically deploy everything via Github workflow.
See `.github/main.yml` workflow for more info.

In short, it does this if it gets triggered by a new tag:

- Takes source code from `master` branch and extracts the newest version from tag.
- Configures environment variables used by docker containers from Github repository's secrets.
- Builds and pushes all apps as Docker images to DockerHub.
- Copies environment variables and docker-compose files to Azure VM.
- Stops `starsky-frontend` containers on Azure VM, pulls the newest images and starts the containers again.