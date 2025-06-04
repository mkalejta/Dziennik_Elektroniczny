#!/bin/bash
set -e

# Upewnij się, że buildx jest aktywny
docker buildx create --use --name multiarch-builder 2>/dev/null || docker buildx use multiarch-builder

# Lista usług
SERVICES=(
  attendance-service
  classes-service
  grades-service
  messages-service
  subjects-service
  timetable-service
  users-service
)

CLIENTS=(
  # web-client
  # admin-panel
  reports-client
)

# Budowanie i wypychanie wieloplatformowych obrazów
# for SERVICE in "${SERVICES[@]}"; do
#   echo "Buduję wieloplatformowy obraz: mkalejta/${SERVICE}:latest"
#   docker buildx build --platform linux/amd64,linux/arm64 \
#     -t mkalejta/${SERVICE}:latest \
#     -f services/${SERVICE}/Dockerfile . \
#     --push
# done

for CLIENT in "${CLIENTS[@]}"; do
  echo "Buduję wieloplatformowy obraz: mkalejta/${CLIENT}:latest"
  docker buildx build --no-cache --platform linux/amd64,linux/arm64 \
    -t mkalejta/${CLIENT}:latest \
    -f clients/${CLIENT}/Dockerfile . \
    --push
done

echo "Wszystkie obrazy zostały zbudowane i wypchnięte jako wieloplatformowe!"
