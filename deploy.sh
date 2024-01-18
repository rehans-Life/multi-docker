docker build -t rehanslife/multi-client:latest -t rehanslife/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t rehanslife/multi-server:latest -t rehanslife/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t rehanslife/multi-worker:latest -t rehanslife/multi-worker:$SHA -f ./worker/Dockerfile ./worker

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push rehanslife/multi-client:latest
docker push rehanslife/multi-server:latest
docker push rehanslife/multi-worker:latest

docker push rehanslife/multi-client:$SHA
docker push rehanslife/multi-server:$SHA
docker push rehanslife/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployments/client-deployment client=rehanslife/multi-client:$SHA
kubectl set image deployments/server-deployment server=rehanslife/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=rehanslife/multi-worker:$SHA

docker logout
gcloud auth revoke --all
