FROM mongo

COPY init.json /init.json
RUN rm -rf /data/db/*
CMD mongoimport --host mongodb --db api --collection adminusers --type json --file /init.json --jsonArray