rm -rf bundle
mkdir bundle
cp build/index.js bundle
docker build -f npm-scripts/Dockerfile.bundle -t wab-lambda .
docker run -it --rm -v `pwd`/bundle:/host wab-lambda mv ./node_modules /host
zip -ruX bundle.zip bundle/node_modules bundle/index.js
rm -rf bundle
