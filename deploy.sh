# build images with 2 tags and use commit version uniquely identify the version of the image kubernetes should be pulling
docker build -t hlcphantom/multi-client:latest -t hlcphantom/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t hlcphantom/multi-server:latest -t hlcphantom/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t hlcphantom/multi-worker:latest -t hlcphantom/multi-worker:$SHA -f ./worker/Dockerfile ./worker

# push to hub
docker push hlcphantom/multi-client:latest
docker push hlcphantom/multi-server:latest
docker push hlcphantom/multi-worker:latest

docker push hlcphantom/multi-client:$SHA
docker push hlcphantom/multi-server:$SHA
docker push hlcphantom/multi-worker:$SHA

# apply all configs
kubectl apply -f k8s

# pull images from commited version
kubectl set image deployments/client-deployment client=hlcphantom/multi-client:$SHA
kubectl set image deployments/server-deployment server=hlcphantom/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=hlcphantom/multi-worker:$SHA