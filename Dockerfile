FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/weather /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
