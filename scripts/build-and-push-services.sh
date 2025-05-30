#!/bin/bash
set -e

SERVICES=(
  attendance-service
  classes-service
  grades-service
  messages-service
  subjects-service
  timetable-service
  users-service
)

for SERVICE in "${SERVICES[@]}"; do
  echo "Buduję obraz: mkalejta/${SERVICE}:latest"
  docker build -t mkalejta/${SERVICE}:latest -f services/${SERVICE}/Dockerfile .
  echo "Wypycham obraz: mkalejta/${SERVICE}:latest"
  docker push mkalejta/${SERVICE}:latest
done

echo "Wszystkie obrazy zostały zbudowane i wypchnięte!"