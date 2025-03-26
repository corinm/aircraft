FROM denoland/deno:2.2.5

WORKDIR /usr/src/app


COPY deno.json ./
RUN deno install

# Commented out as was causing a permissions issue during installation of mongoose
# USER deno

COPY . .

# RUN deno cache main.ts

CMD ["run", "--allow-read", "--allow-sys", "--allow-env", "--allow-net", "main.ts"]
