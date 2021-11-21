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