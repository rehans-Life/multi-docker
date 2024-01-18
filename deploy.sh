docker build -t rehanslife/multi-client:latest -t rehanslife/multi-client:$SHA ./client
docker build -t rehanslife/multi-server:latest -t rehanslife/multi-server:$SHA ./server
docker build -t rehanslife/multi-worker:latest -t rehanslife/multi-worker:$SHA ./worker

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

docker push rehanslife/multi-client:latest
docker push rehanslife/multi-server:latest
docker push rehanslife/multi-worker:latest

docker push rehanslife/multi-client:$SHA
docker push rehanslife/multi-server:$SHA
docker push rehanslife/multi-worker:$SHA

kubectl apply -f k8s

kubectl set image deployment/client-deployment client=rehanslife/multi-client:$SHA
kubectl set image deployment/server-deployment server=rehanslife/multi-server:$SHA
kubectl set image deployment/worker-deployment worker=rehanslife/multi-worker:$SHA

docker logout
gcloud auth revoke --all