# Reference Implementation

The _Distributed Hosting Engine_ comes with a reference implementation that follows the
specification as described in the [Whitepaper] and complementary documents. This
implementation can be found in this directory.

## The Components

**Smart Proxy:** The user connects via the _Smart Proxy_ to the internet. This component
takes care of the routing and triggers blockchain downloads if necessary. It allows verifies
the authenticity of a page by validating each response against the checksum stored in the
related blockchain.

**Blockchain Handler:** Manages a multitude of blockchains (one for each visited page) and
takes care of updates and propgates received and created transactions to the network. It also
takes care about the blockchain overlay network and optimizes it, based on different metrics.

**Hosting Component:** This component takes care of all hosting and content management related
tasks. Like creating Tor Hidden Services, Filesharing snapshot of own and other pages, ...

## Communication between Components

The communication between components is done via [ZeroMQ] queues, for the following reasons:

* ZeroMQ is a broker-less queueing library. That means there is no need run a queueing server.
* Support for different pattern, like pipeling or pub/sub. More powerful patterns allow the
implementation of failsafe nodes, without much efforts and also a more natural integration.
* Support for local or remote communications. That allows to spread the components accross
different machines.
* The robust protocol makes the whole communication more stable and the implementation simpler.
No matter what components goes temporary down, the communication can continue afterwords
without problems.

### Blockchain Handler -> Hosting Component

The _Blockchain Handler_ triggers the download of a snapshot by sending a message to the
_Hosting Component_. Such a message is send each time a new _UPDATE_ transaction is received,
as part of a _Block_

    {
      "time" : 1427744420, # Unix time of the received transaction
      "snapshot": "magnet:?xt=urn:btih:$snapshot_sha1&xs=magicno://$magicno_value",
      "hosts": ["host1.onion","..."] # Hosts used for the BitTorrent DHT
    }

### Proxy -> Blockchain Handler

If the _Proxy_ can not find a blockchain for an accessed host, it notifies the
_Blockchain Handler_ with the following message. These messages are cached for a
short time period, in order to avoid sending the same request multiple times.


    {
      "hostname": "host1.onion"
    }


[Whitepaper]: https://github.com/networld-to/blackgate/raw/master/whitepaper/distributed_hosting_whitepaper.pdf "Distributed Hosting Whitepaper"
[ZeroMQ]: http://zeromq.org/ "ZeroMQ"
