[![Build Status](https://travis-ci.org/triforkse/mesos-ui.svg)](https://travis-ci.org/triforkse/mesos-ui) [![Coverage Status](https://coveralls.io/repos/triforkse/mesos-ui/badge.svg?branch=master&service=github)](https://coveralls.io/github/triforkse/mesos-ui?branch=master)

# YAMU - Yet Another Mesos UI

A UI for getting an overview of your Mesos cluster.

## Planned Features

☐ Nice Looking Visual Overview of Cluster Resources  
☐ Simple Configuration of Frameworks through ProtoBuf.
☐ Client Library for supporting frameworks to expose their configuration
☐ REST API
☐ Adaptors for Frameworks that do not yet support YAMU

# Developer Setup

To get started run

```bash
$ make setup
```

This will install any dependencies.

The project consists of a web client, and an API. These two can be deployed
separately. You also need to start them separately:

```bash
$ cd api && make run
$ cd client && make run
```

This will also run your unit tests while developing.

## Tests

You can run the tests manually by running:

```bash
make test
```

If you wish to run the E2E tests you can either do it by running:

```bash
$ make test-e2e
```

This requires that you have both the `client` and `api` running on
your machine.

You can also execute them in docker containers, using:

```bash
$ make docker-e2e
```

### To Get Growl Test Notifications Working

#### MacOS X Dev Setup

```bash
$ sudo gem install terminal-notifier
```

#### Ubuntu Dev Setup

```bash
$ sudo apt-get install libnotify-bin
```

## License

MIT, see the LICENSE file for details.
