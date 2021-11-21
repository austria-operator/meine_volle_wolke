FROM node:14-alpine3.12

RUN apk add curl bash

RUN curl -O 'https://raw.githubusercontent.com/tavinus/cloudsend.sh/v2.2.1/cloudsend.sh' \
    && chmod +x cloudsend.sh
RUN mv cloudsend.sh /bin/cloudsend.sh

RUN addgroup -g 1001 -S nonroot && \
    adduser -u 1001 -S nonroot -G nonroot
 
WORKDIR /home/nonroot
USER 1001:1001

COPY src src
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install

ENTRYPOINT ["npx", "ts-node", "src/index.ts"]
CMD ["pony"]