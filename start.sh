docker build -t jsenht/deliverwaterso:1.0.1 .
docker push jsenht/deliverwaterso:1.0.1
docker run -it -p 7083:7083 --network=deliver --link dbredis:dbredis --link dbmongo:dbmongo jsenht/deliverwaterso:1.0.1
docker run -d -p 7083:7083 --name deliverwaterso --network=deliver --link dbredis:dbredis --link dbmongo:dbmongo jsenht/deliverwaterso:1.0.1
