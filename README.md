# dev-env-manager

[![npm version](https://badge.fury.io/js/%40rosesoft%2Fdev-env-manager.svg)](https://badge.fury.io/js/%40rosesoft%2Fdev-env-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**dev-env-manager** simplifies the setup of development environments by downloading and uploading `.env` files from systems you're already using for development, making it easy to share them with other developers.

---

If you're frustrated by the process of checking out a repository and then having to figure out which developer has the correct environment settings on their machine, only to wait until they’re available to send the files via chat or email - I get it, that’s annoying.

The goal of this tool is simple: clone a repository, run a single command, and you're ready to go.

This is a very simple solution that is easy to set up and a better alternative to sending `.env` files via email. If you're looking for a more robust, enterprise-grade solution, consider using:

- [HashiCorp Vault](https://www.vaultproject.io)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager)
- [Doppler](https://www.doppler.com)

### Demo

![dev-env-manager Demo](assets/dev-env-manager.gif)

### Currently supported stores:

- Kubernetes (K8s) Secrets

> **Security Note**: Kubernetes Secrets are not the most secure storage for sensitive information. Only individuals who need access to these secrets should have access to the cluster. Proper role-based access control (RBAC) and encryption should be employed to secure the secrets.

### Planned features:

- AWS Secrets Manager
- Show the diff between local and remote files

Contributions are welcome!

---

## Installation

Install the tool with Yarn or NPM:

```sh
yarn add @rosesoft/dev-env-manager
# or
npm install @rosesoft/dev-env-manager
```

---

## Setup

Create a file called `environment.config.json` in the root of your repository.

Example:

```plain
environment.config.json
```

```json
{
  "environmentSettings": {
    "kubeConfigPath": ".kube/config",
    "context": "colima",
    "namespace": "dev-namespace",
    "secrets": [
      {
        "name": "dev-service-a",
        "localPath": "sample-project/service-a/local.env"
      },
      {
        "name": "dev-service-a-container",
        "localPath": "sample-project/service-a/docker/container.env"
      },
      {
        "name": "dev-service-b",
        "localPath": "sample-project/service-b/.env"
      }
    ]
  }
}
```

---

Add the following scripts to your `package.json`:

```json
"scripts": {
  "upload-env-files": "dev-env-manager --upload",
  "download-env-files": "dev-env-manager --download",
}
```

---

_Please note that for the sample project, I am using the following scripts:_

```json
"scripts": {
  "download-env-files": "bin/start.sh --download",
  "upload-env-files": "bin/start.sh --upload"
}
```

_This is because I cannot use my NPM module within itself. For typical usage in other projects, you should be able to use the dev-env-manager command via NPM._

## Usage

You can now run the following commands:

```sh
npm run upload-env-files
npm run download-env-files
# or
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

Create some `.env` files:

- `sample-project/service-a/local.env`
- `sample-project/service-a/docker/container.env`
- `sample-project/service-b/.env`

Run the following command:

```sh
npm run upload-env-files
# or
yarn upload-env-files
```

You will see output like this:

```plain
$ yarn upload-env-files
yarn run v1.22.22
$ ./bin/start.sh --upload
Config loaded.
Current context set to: colima, Namespace set to: dev-namespace
------------------------------------------------------
-          Uploading Environment Settings            -
------------------------------------------------------
? Select the files you want to upload to k8s: (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◯ sample-project/service-a/local.env
 ◯ sample-project/service-a/docker/container.env
 ◯ sample-project/service-b/.env
```

Select the files you want to upload and press Enter.

### Delete the local `.env` files:

```sh
rm sample-project/service-a/local.env
rm sample-project/service-a/docker/container.env
rm sample-project/service-b/.env
```

### Download the `.env` files:

Run the following command:

```sh
npm run download-env-files
# or
yarn download-env-files
```

You will see output like this:

```plain
$ yarn download-env-files
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
