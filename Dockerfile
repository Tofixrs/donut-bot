FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY sern.config.json ./
COPY tsconfig.json ./

RUN npm i -g @sern/cli
RUN apk add ffmpeg
RUN npm ci --only=production

COPY . .

RUN npm run build

CMD ["npm", "start"]
