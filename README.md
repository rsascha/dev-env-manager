# dev-env-manager

[![npm version](https://badge.fury.io/js/dev-env-manager.svg)](https://badge.fury.io/js/dev-env-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**dev-env-manager** simplifies the setup of development environments by downloading and uploading `.env` files from secret stores. The goal is to clone a repository, run a single command, and be ready to go.

### Currently supported secret stores:

- Kubernetes (K8s) Secrets

### Planned features:

- AWS Secrets Manager
- Show the diff between local and remote files

Contributions are welcome!

---

## Installation

Install the tool with Yarn or NPM:

```sh
yarn add dev-env-manager
npm install dev-env-manager
```

---

## Setup

Create a file called `environment.config.json` in the root of your repository.

Example:

```json
{
  "environmentSettings": {
    "kubeConfigPath": ".kube/config",
    "context": "colima",
    "namespace": "dev-namespace",
    "secrets": [
      {
        "name": "dev-service-a",
        "localPath": "projects/service-a/local.env"
      },
      {
        "name": "dev-service-a-container",
        "localPath": "projects/service-a/docker/container.env"
      },
      {
        "name": "dev-service-b",
        "localPath": "projects/service-b/.env"
      }
    ]
  }
}
```

---

## Usage

Add the following scripts to your `package.json`:

```json
"scripts": {
  "download-env-files": "npx dev-env-manager --download",
  "upload-env-files": "npx dev-env-manager --upload"
}
```

You can now run the following commands:

```sh
yarn upload-env-files
yarn download-env-files
```

---

## Sample Project

You can check the sample project in the `./sample-project` directory.

The `environment.config.json` file must be in the root of the repository. You need a running Kubernetes cluster.

If you don't have one, you can use **Colima**:

```sh
brew install docker docker-buildx kubectl colima

colima start
colima kubernetes start

kubectl create namespace dev-namespace
```

### Upload `.env` files:

Run the following command:

```sh
yarn sample-project:upload-env-files
```

You will see output like this:

```plain
$ yarn sample-project:upload-env-files
yarn run v1.22.22
$ ./bin/start.sh --upload
Config loaded.
Current context set to: colima, Namespace set to: dev-namespace
------------------------------------------------------
-          Uploading Environment Settings            -
------------------------------------------------------
? Select the files you want to upload to k8s: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◯ sample-project/projects/service-a/local.env
 ◯ sample-project/projects/service-a/docker/container.env
 ◯ sample-project/projects/service-b/.env
```

Select the files you want to upload and press Enter.

Verify that the secrets were successfully created:

```sh
kubectl get secrets -n dev-namespace
```

### Delete the local `.env` files:

```sh
rm sample-project/projects/service-a/local.env
rm sample-project/projects/service-a/docker/container.env
rm sample-project/projects/service-b/.env
```

### Download the `.env` files:

Run the following command:

```sh
yarn sample-project:download-env-files
```

You will see output like this:

```plain
$ yarn sample-project:download-env-files
yarn run v1.22.22
$ ./bin/start.sh --download
Config loaded.
Current context set to: colima, Namespace set to: dev-namespace
------------------------------------------------------
-          Downloading Environment Settings          -
------------------------------------------------------
Downloading secret:
- dev-service-a
- to store content to file: sample-project/service-a/local.env
Downloaded secret dev-service-a to sample-project/service-a/local.env
Downloading secret:
- dev-service-a-container
- to store content to file: sample-project/service-a/docker/container.env
Downloaded secret dev-service-a-container to sample-project/service-a/docker/container.env
Downloading secret:
- dev-service-b
- to store content to file: sample-project/service-b/.env
Downloaded secret dev-service-b to sample-project/service-b/.env
✨  Done in 0.92s.
```
