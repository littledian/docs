#!/bin/bash

# install dependencies
echo start install node_modules
yarn

# build assets
yarn build

# build images

timestamp=`date "+%Y%m%d%H%M%S"`
prefix="react-template"
containerName="react-template";
port="3000"
tag="$prefix:$timestamp"

docker build -t "$tag" .

# stop current container

have=$(docker inspect --format='{{.Name}}' $(docker ps -aq) |grep $containerName  | cut -d"/" -f2)
if [[ "$have" == "$containerName" ]]; then
  docker container stop $containerName
  docker container rm $containerName
fi

# remove prev images

tags=$(docker images | grep $prefix | awk '{print $2}')
for item in $tags
do
  if [[ $tag != "$prefix:$item" ]]; then
        docker rmi "$prefix:$item"
  fi
done

# start current image
docker run -d -p "$port:$port" --name $containerName --restart always "$tag"
