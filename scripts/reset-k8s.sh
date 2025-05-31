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

echo "Czekam aż pody web-client, admin-panel i keycloak będą w stanie Running..."

for app in web-client admin-panel keycloak; do
  echo -n "Czekam na pod $app..."
  for i in {1..120}; do
    status=$(kubectl get pods -n dziennik -l "io.kompose.service=$app" -o jsonpath="{.items[0].status.phase}")
    if [ "$status" == "Running" ]; then
      echo " OK"
      break
    fi
    sleep 1
    if [ $i -eq 120 ]; then
      echo " NIE POWIODŁO SIĘ"
      exit 1
    fi
  done
done

echo "Wszystkie wymagane pody są gotowe."

kubectl port-forward svc/web-client 5173:80 -n dziennik &
kubectl port-forward svc/admin-panel 4000:4000 -n dziennik &
kubectl port-forward svc/keycloak 8080:8080 -n dziennik &
kubectl port-forward svc/api-gateway 8081:8081 -n dziennik &

echo "Port-forwarding uruchomiony. Dostęp:"
echo "Web-client:   http://localhost:5173"
echo "Admin-panel:  http://localhost:4000"
echo "Keycloak:     http://localhost:8080"
echo "API Gateway:  http://localhost:8081"

wait