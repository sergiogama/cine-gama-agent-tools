export DOCKER_CLIENT_TIMEOUT=300
export COMPOSE_HTTP_TIMEOUT=300
docker compose up

orchestrate server start -e ./.env --with-langflow

# Se der erro de porta

# docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}" 
# ou docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}" | grep 3000

# e depois:
# docker stop <container_id>

# ou
# sudo lsof -i :3000
# sudo kill -9 <PID>


