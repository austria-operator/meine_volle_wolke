# Meine Volle Wolke

Meine Wolke will ein Pony.

## Quick Start

```sh
docker build -t mvw .
docker run --name mvw --rm mvw "image search term"
```

### Ohne Build

```sh
docker pull austriaoperator/meine_volle_wolke
docker run --name mvw --rm austriaoperator/meine_volle_wolke "image search term"
```

## Helm

```sh
helm install mvw --set replicaCount=1 ./chart
helm upgrade mvw --set replicaCount=5 ./chart
helm remove mvw
```
