# First building Next.js project, using node base image
FROM node:14 as build-stage

# Setting working dir inside container
WORKDIR /nextapp

# Required to install packages
COPY package*.json ./

# Installing npm packages for Next.js
# This line has been tested already, but might change it to "npm install" when I can test locally
RUN npm install next react react-dom

# Copying over entire Next.js project
COPY . .

# Creating production build to serve through nginx
RUN npm run build

# Starting second, nginx build-stage
FROM nginx:1.15

# Removing default nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# Copying our nginx config
COPY nginx.conf /etc/nginx/conf.d/

# Copying production build from last stage to serve through nginx
COPY --from=build-stage /nextapp/out/ /usr/share/nginx/html

# Exposing port 8080 on container
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]