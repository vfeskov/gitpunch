rm -rf lib bundle bundle.zip
cp -rf ../lib lib
mkdir bundle
cp build/index.js bundle
docker build -f npm-scripts/Dockerfile.bundle -t wab-lambda .
docker run -it --rm -v `pwd`/bundle:/host wab-lambda mv ./node_modules /host
cd bundle
zip -ruX ../bundle.zip node_modules index.js
rm -rf ../bundle ../lib
