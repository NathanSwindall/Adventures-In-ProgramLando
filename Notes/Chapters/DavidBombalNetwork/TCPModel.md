---
layout: post
category: notes
image: /Notes/assets/images/DavidBombal.jpg
summary: A beginner's guide to Networking
date: 2021-02-23
author: Nathan Swindall
---

### **TCP/IP Model**


## Sending out an email

These notes are probably hard to follow because I am using a specific setup on packet tracer in order to follow an email from a computer to a server.First the computer doesn't know the MAC address for the server it is sending the packet to, but it does know the IP address for it. It will thus use a broadcast MAC address which is FFFF.FFFF.FFF if you look at the beginning of a packet tracer simulation. 

```plain
Layer 4: TCP Src Port: 1025, Dst Port: 25
```

Looking at some layer 4 numbers we see that the Dst Port 25 is the smtp port. Thus our email will be going to this port on the server because this port handles email data. It wouldn't go to port 80, becuase this is an http port. Src Port 1025 is a random port. 

```plain
Layer 3: IP Header Src. IP: 10.1.1.99, Dest. IP: 10.1.1.100
```

The iP address of the computer is the src and the iP address of the server is the Dest.


```plain
Ehternet II Header 0060.3EE7.1199 >> FFFF.FFFF.FFFF ARP
Packet Src. IP: 10.1.1.99, Dest. IP: 10.1.1.100
```

Now we are sending it to the switch. The switch doesn't know the MAC address, so it will send out a broadcast signal to all the devices on the network to find the device with the IP address of 10.1.1.100. ARP means Address Resolution Protocol. We are trying to get the MAC address. 

How does each layer refer to the next layer. Well, on the eithernet layer you can see we have `TYPE: 0x0806.` This means that the Layer 3 network protocol is `ARP`. 


When the computer in the connection finally learns what the MAC address is, it then sends out the email with the MAC address of the server. In Layer 2, the `TYPE: 0x0800` means that this device is IP_4 protocol. In Layer 3, we learn that the `PRO: 0x06` means that we are dealing with a TCP packet. This TCP in layer 4 carries a source and destination port. The destination port of 25 stands for the `smtp` protocol which is mean for emails.


