#!/usr/bin/env python

import BaseHTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler

addr = ("0.0.0.0", 8000)

serv = BaseHTTPServer.HTTPServer(addr, SimpleHTTPRequestHandler)

print "Now serving on {} : {}".format(addr[0], addr[1])

serv.serve_forever()
