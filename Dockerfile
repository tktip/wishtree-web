FROM joshix/caddy:v0.11.3

COPY build /var/www/html
COPY etc/Caddyfile /etc/caddy/Caddyfile

CMD ["-conf", "/etc/caddy/Caddyfile"]
