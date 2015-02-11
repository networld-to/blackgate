<pre>
Specs Number:   10
Title:          The Blockchain Specification
Status:         Alpha Draft
Type:           Core Specification
Created:        2015-02-11
</pre>

#0 Introduction

**_ATTENTION: This is only a first draft and does not yet reflect the version
the blockchain that will be implemented. The main purpose of this draft is to
trigger discussions._**

The following document specifies a blockchain used for decentralized content
hosting. It is based on the first reference implementation of a blockchain,
[Bitcoin][bitcoin]. In difference to the original blockchain, this blockchain
is no financial asset, but manages and coordinates redundant content on
decentralized nodes. The first discussed use case, on which this blockchain is
based, is the decentralized hosting of blogs or websites in a network of
well-know nodes, e.g. friends that know the each others blog domain.

#1 Blockchain

Each content provider (aka. website owner) starts a new blockchain with the
genesis block, that proofs ownership of a onion domain and the content.

##1.1 Transaction Definition

Overview about different types of transactions, a more detailed specification
is following.

* **UPDATE:** The content creator aka. owner can update the content by proofing
ownership and by publishing the full content or only the differences, e.g.
http://$ONION_DOMAIN/$HASH_OF_NEW_SNAPSHOT. This content is referenced
inside the UPDATE transaction and propagated to all know nodes that have this
blockchain.
* **NEW_NODE:** If a new node gets the blockchain and starts hosting a clone of
the content, it propagates the onion domain to the network, by creating a new
NEW_NODE transaction, that verifies ownership about the mentioned domain (use
for this the related private key of onion domain). This message is only send
ones and should only verify that a new domain for this specific content is available. For version update propgation see CLONE transaction.
* **CLONE:** By sending a verified CLONE transaction through the network, a
node confirms that it has received and that it hosts the mentioned version.
This transaction informs all nodes who has the latest version.

##1.1 Block Definition

A block includes multiple transactions. By having a suitable mining process it
could be assured that only valid transactions are part of a block and hence
verified by the network. For example an UPDATE transaction by everybody else,
except the owner should be always rejected and never be part of a block.

**TODO:** Figure out how the mining process should look like.

#2 The Protocol

In order to guarantee a fast and seamless hosting of content in a highly
dynamic and unpredictable environment a robust protocol has to be developed,
that distributes and manages the blockchains for all nodes.

Here are some unsorted thoughts about the properties of this protocol.

* **Asynchronous distribution in the background:** Each node runs a daemon that
is responsible for the blockchain handling. It manages multiple, independent
blockchains (for each website one) and updates all of them regularly. This
allows to serve a local copy of website if the user access it via browser.
* **Remove expired content:** In order to be able to scale, at least to some
practical degree, Old content will expire and can be deleted. Dependent on
multiple properties - like last access, last update, ... - the content is
marked as expired.
* **Fetch blockchain on first website access:** If there is no local copy of
the blockchain, the blockchain should be requested from the accessed node and a
local copy should be made. After successful cloning of content and blockchain
the newly created onion domain will be propagated via the blockchain to all
known nodes, but at least back to the original node. This allows users to
access this, alternative, domain if the content creator is offline. Other nodes
now know that they can contact this node if the original node is offline.

[bitcoin]: https://bitcoin.org/bitcoin.pdf "Bitcoin: A Peer-to-Peer Electronic Cash System"
