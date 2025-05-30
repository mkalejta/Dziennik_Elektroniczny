#!/bin/bash
set -e

kubectl delete namespace dziennik --ignore-not-found

echo "Czekam aż namespace zostanie usunięty..."
while kubectl get namespace dziennik &> /dev/null; do
  sleep 1
done

kubectl create namespace dziennik

kubectl config set-context --current --namespace=dziennik

echo "Tworzę zasoby bazowe (sekrety, configmapy, ingress)..."
kubectl apply -f k8s/base/

echo "Tworzę bazy danych i Keycloak..."
kubectl apply -f k8s/databases/
kubectl apply -f k8s/keycloak/

echo "Tworzę serwisy core (backend)..."
kubectl apply -f k8s/core/

echo "Tworzę frontend..."
kubectl apply -f k8s/frontend/

if [ -d k8s/infra ]; then
  echo "Tworzę zasoby infrastrukturalne (infra)..."
  kubectl apply -f k8s/infra/
fi

echo "Gotowe! Wszystkie zasoby zostały odtworzone w namespace dziennik."