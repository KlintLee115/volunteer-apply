FROM node:lts-alpine
COPY . .
RUN npm i
RUN npm run build
RUN npm prune --production
EXPOSE 3000
ENV PORT=3000
CMD [ "npm", "run", "start" ]