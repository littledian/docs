#!/bin/bash
timestamp=`date "+%Y%m%d%H%M%S"`
tag="littledian/docs:$timestamp"

docker build -t "$tag" .

have=$(docker inspect --format='{{.Name}}' $(docker ps -aq) |grep docs  | cut -d"/" -f2)
if [[ $have == "docs" ]]; then
  docker container stop docs
  docker container rm docs
fi

tags=$(docker images | grep littledian/docs | awk '{print $2}')
for item in $tags
do
  if [[ $tag != "littledian/docs:$item" ]]; then
        docker rmi littledian/docs:$item
  fi
done

docker run -d -p 3000:80 --name docs --restart always $tag
