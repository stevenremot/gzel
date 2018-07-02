DOCKER_IMAGE=node:10-alpine
DOCKER_WORKDIR=/home/node/app/
DOCKER_BIND_ARGS=--mount type=bind,source=`pwd`,destination=$(DOCKER_WORKDIR)
DOCKER_RUN=docker run -w $(DOCKER_WORKDIR) $(DOCKER_BIND_ARGS)

.PHONY: ssh install start clean

sh:
	$(DOCKER_RUN) -ti $(DOCKER_IMAGE) sh

install:
	$(DOCKER_RUN) $(DOCKER_IMAGE) npm install

clean:
	rm -rf dist/
