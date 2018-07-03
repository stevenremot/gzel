DOCKER_IMAGE=node:10-alpine
DOCKER_WORKDIR=/home/node/app/
DOCKER_BIND_ARGS=--mount type=bind,source=`pwd`,destination=$(DOCKER_WORKDIR) \
  --mount type=bind,source=`pwd`/../core,destination=$(DOCKER_WORKDIR)../core
DOCKER_RUN=docker run -w $(DOCKER_WORKDIR) $(DOCKER_BIND_ARGS) -p 1234:1234

.PHONY: sh start clean

sh:
	$(DOCKER_RUN) -ti $(DOCKER_IMAGE) sh

start:
	$(DOCKER_RUN) -ti -e WASM_URL=$(WASM_URL) $(DOCKER_IMAGE) npx parcel serve index.html

clean:
	rm -rf dist .cache
