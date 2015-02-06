# Black Gate - Mobile Deep Web Hidden Services
A project that introduces a decentralized, mobile and private communication network.

Write a short e-mail to **blackgate@riseup.net** if you are interested in this project. This motivates to push this project further and to publish the current results.

## Security & Privacy Measurements

The following measurements apply partially to the general infrastructure and partially to the hosted IRC server.

* Only accessible via TOR Hidden Service
* Separated .onion address for each client; protected with authentication cookie in stealth mode
* Server runs in a separate FreeBSD Jail inside a VirtualBox instance
* Optional SSL encryption with well known fingerprint for MITM prevention
* No content logging and highly recommended use of OTR encryption
* Only temporary accessible and only for a selected, trusted group
* Server is on-the-go and changes physical location
* No local and remote OPER access, to prevent admin right escalations
* Deactivated CTCP commands
* Enhanced privacy, e.g. no idle times, no part/quit messages, no /whowas
* Each client has the same internal IP address and even that IP is masked
* No services and no bots, less code is more and prevents logging by third parties

## Security Layers

    |-------------------------|
    |   Host System with TOR  |   Service encapsulation with different .onion
    |-------------------------|   addresses and explicit NAT port forwarding
        |               ^
        v               |
    |-------------------------|
    |   VirtualBox FreeBSD    |   Portable and hardened virtual base system
    |-------------------------|   inside a VirtualBox instance
        |               ^
        v               |
    |-------------------------|
    |   (IRC) Service Jail    |   Encapsulated daemons inside internal
    |-------------------------|   virtual instances

## Encyrption Layers

           |-------------------------|
    Client | Optional OTR Encryption |   Client-to-Client (Highly recommended)
           |-------------------------|   aka. End-to-End
    ============ | ============= ^ =================================================
                 v               |
           |-------------------------|
    Server | Optional SSL Encryption |   Server-to-Client (Not necessary needed)
           |-------------------------|
                 |               ^
                 v               |
           |-------------------------|
    Server | Tor Network Encryption  |   Network
           |-------------------------|
           
    SSL (6697) and Tor encryption is provided by this infrastructure. OTR is alone
    your responsibility and has to be used on both sides of the conversation. Also
    without using SSL you are pretty save, the same is not true for missing OTR.
