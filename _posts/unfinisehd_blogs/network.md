# Network components

Node - any device that transmits and receives data
Host - (also a node). receive and transmit data at the end. Has nodes in the middle
    -Writing the letter (host) and post office are the nodes
Media - Pathway that the host and node communicate through like cabeling, wifi, cell phone frequency
Data - (bytes, we can ) 8 bits is a byte. Octet? 4 bits is a nibble. Word is 32 bits or 64 bits.
Bit - zeros and ones ( represents the smallest unit of data that can be transmitted)
Networking device - Connected into the network, but not making the traffic. Can help in delivering traffic. 



# Physical vs Logical networks

physical - cables, network hardware, cables
Logical - information carried by the physical network
    - All you care about is the address that y ou mail the letter to. 
    - Physical is how the letter gets there. 


# Networking challenges

Availability - there working when you need it. 
Reliability - keeping up
Serviceability - can you maintain it
Performance
Security
Scalability
Compatibility - Compatibility (mixture of different OS or different Vendor equipment)
Quality of Service (QoS) - Allot a percetage of your bandwidth for certain traffic. (I want my webpage to have a lot of bandwidth)


# Assement: Networking concepts

What sort of a device may or may not be a host, depending on context? Choose the best response
-host is a beginning or ending point. 
-A file server
-A printer ()
-A switch (more routing traffice)
-A user workstation

The physical and logical network cna't be totally separated
True

What qualities should a high-performance network have
-low latency 
-Hig throughput


# Scope 

Physical extent, how far apart they are

Most common scopes
-Local Area Networks (LAN)
-Wide Area Networks (WAN)
    extends over a very large area
    with nodes in multiple cities
Other scoopes
-Campus Area Network (CAN)
-Metropolitan Area Network (MAN)
-Personal Area Network (PAN)


# Topology 
How are the nodes connected to eachother. 

-line topology
    -Daisy chain
-Bus topology
    -each computer taps into a specific line
-Ring topology
    -All devices are connected in a ring
-Star topology
    -Most LANS today use star topology
    -Central hub-and-spoke technology
-Mesh topology
    Each computer has a connection to every other computer
    partial mesh
    -More than one pathway to get traffic around the internet
-hybrid topology
    Combining multiple toplogies together
Logical topologies


# Resource-sharing models
Anything you wnat access on a network is caled a resource
-You might want to connect to a printer or get access to a file

-peer-to-peer
-client-server
    -servers share resources to the client.


# OSI model

Vendor neutral and a common framework for network equipment. These are the standards for networking. 


Layer 7 Application (Like MS word, kind of data)
Layer 6 Presentation (encryption)
Layer 5 Session ( Make sessions)
Layer 4 Transport ( all of the data gets from point a to point b)
    -Data needs to be broken down into Segments (1500 bits).
    -Each segment needs to be delivered. 
Layer 3 Network

Layer 2 Data Link
    -Post office figuring out which zip code its going to 
Layer 1 Physical
    -Where the binary data gets changed over to electricity and then transmitted. Fiber optic with light? Radio frequency with frequency?

OSI
    encapsulation 
        -The headers are added to the front of the data. These data headers are stripped off for each layer. 

# Data in the OSI Model
Layer 2 : organized into a frame
Layer 3 : organized into a packet
Layer 4 : organized into a segment


# The TCP/IP model

Application Layer
    -Layer 7
    -Layer 6
    -Layer 5

Transport layer 
    -Transport

Internet Layer 
    -network

Network Interface
    -Data Link
    -Physical


# Troubleshooting methodology



# Ethernet

Lan communication

# signaling and modulation

digital baseband, or line coding. A method used by ethernet cables

A carrier wave is how we carry signals from very far away places. 

1 gbps per second

# Bit rate and bandwidth

bandwidth is always in bits
storage is in bytes

# Multiplexing

Space/Frequency/Time 


# Data Link

LLC - What protocol to hand the data off to next once the data goes to the next level.

Physical

# Channel access

half duplex -sending and receiving but not at the same time
full duplex -sending and receiving at the same time. 

# MAC addresses

A physical address corresponding to a particular network interface


# Unicast, broadcast, and multicast

Unicast - one address
broadcast - all groups
multicast - special address you can put on a frame that will allow some but now all computers to see the message

# Frame Check sequence

# Bridges



# Switches

A layer 2 switch is nothing more than a bridge with three or more ports, just like a hub is to a repeater
-remembers where MAC addresses are just like a bridge

# Layer 3 devices


