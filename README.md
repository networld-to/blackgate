# Distributed Hosting Blockchain

This project consists of a set of specifications for a hosting blockchain with
related protocol and a related reference implementation. The main document is
the [Whitepaper]. The official web presence can be found under
http://blackgate.networld.to.

## What is the aim of this project?

The goal of this project is to design and develop a truly distributed hosting
protocol that is capable to host semi-static pages without any central
hosting provider. The resulting paradigm shift could be summarized in the
following sentence: _**Instead of going to a page, the page comes to you!**_

As semi-static pages we define all pages that have no database as backend,
can be distributed in a static way and that evolve via file updates. The idea
was taken from the blog generation engine [Jekyll]. In comparison to
[Wordpress], Jekyll generates static files, after writing a new blog entry or
page. It does not need any dynamic component, like a database and can be hence
distributed easily.

## How are pages distributed?

On access the background logic downloads the related blockchain of that page
and based on different hosting metrics if the page should be stored and/or
hosted locally. This distributes multiple pages on end-user devices and
eliminates hosting provider. By having a smart hosting algorithm it can be
guaranteed that pages are 24/7 online and that accesses are optimized  for
response times, or any other metric, resulting in a self-managed overlay
network for hosting pages.

## What security and privacy implications does that have?

In order to protect the privacy of each node [Tor Hidden Services] are used.
That not only protects senstive information like the geographical location of
the node, that could be extracted from the IP, but also allows to host pages
behind NATs and Firewalls.

The blockchain, a public ledger of page updates and clones, guarantees
cryptographically that the content returned by a random node is the same as the
content published by the content creator. All validations are performed on
client-side and invalid pages are never shown to the user.

## How can I participate?

We encourage as many people as possible to read the specifications, check the
source code and gives us feedback. You can start by reading the [Whitepaper],
contributing to the reference implementation (found in this repository),
develop an alternative implementation, discuss with us changes, ...

Please contact us under `blackgate@networld.to` or approach us personally. We are looking forward to hear from you.

[Whitepaper]: https://github.com/networld-to/blackgate/raw/master/whitepaper/distributed_hosting_whitepaper.pdf "Distributed Hosting Whitepaper"
[Jekyll]: http://jekyllrb.com/ "Jekyll "
[Wordpress]: https://wordpress.org/ "Wordpress"
[Tor Hidden Services]: https://www.torproject.org/docs/hidden-services.html.en "Tor Hidden Services"
