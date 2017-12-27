#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Easy PS4 Exploit Hosting by Al-Azif
   Source: https://github.com/Al-Azif/ps4-exploit-host
"""

from __future__ import print_function

import os
import re
import SimpleHTTPServer
import socket
import SocketServer
import struct
import subprocess
import sys
import threading
import time

SCRIPT_LOC = os.path.realpath(__file__)
CWD = os.path.dirname(SCRIPT_LOC)
FAKE_LOC = os.path.join(CWD, 'FakeDns', 'fakedns.py')
DNS_LOC = os.path.join(CWD, 'dns.conf')
EXPLOIT_LOC = os.path.join(CWD, 'exploit', '')
FILETYPES = {
    '.css': 'text/css',
    '.eot': 'application/vnd.ms-fontobject',
    '.gif': 'image/gif',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript',
    '.otf': 'application/x-font-opentype',
    '.png': 'image/png',
    '.sfnt': 'application/font-sfnt',
    '.svg': 'image/svg+xml',
    '.ttf': 'application/x-font-truetype',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2'
}


class MyTCPServer(SocketServer.TCPServer):
    """TCPServer to allow instant reuse of port 80"""
    def server_bind(self):
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind(self.server_address)


class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    """Handler for HTTP Requests (This is so it works for all languages)

       *ALL* requests will be directed to like named files in EXPLOIT_LOC
    """
    def do_GET(self):
        """Modify default do_GET method"""
        client = self.client_address[0]
        if client == '127.0.0.1' or checklan(client, getnetwork(getlan())):
            try:
                path = self.path.rsplit('/', 1)[-1]
                if re.match('/update/ps4/list/[a-z]{2}/ps4-updatelist.xml', self.path):
                    region = self.path.split('/')[4]
                    with open(os.path.join(CWD, 'updates', 'ps4-updatelist.xml')) as f:
                        xml = f.read()
                        xml = xml.replace('{{REGION}}', region)
                        self.send_response(200)
                        self.send_header('Content-type', 'application/xml')
                        self.end_headers()
                        self.wfile.write(xml)
                elif re.match('/update/ps4/html/[a-z]{2}/[a-z]{2}', self.path):
                    with open(os.path.join(CWD, 'updates', path)) as f:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                        self.end_headers()
                        self.wfile.write(f.read())
                elif self.path.split('/')[1] == 'ps4-exploit-host':
                    with open(os.path.join(CWD, 'updates', path)) as f:
                        self.send_response(200)
                        self.send_header('Content-type', 'text/plain')
                        self.end_headers()
                        self.wfile.write(f.read())
                elif re.match('/document/[a-z]{2}/ps4/', self.path):
                    if not path:
                        path = 'index.html'
                    ext = '.' + path.rsplit('.', 1)[-1]
                    with open(os.path.join(EXPLOIT_LOC, path)) as f:
                        self.send_response(200)
                        self.send_header('Content-type', FILETYPES[ext])
                        self.end_headers()
                        self.wfile.write(f.read())
            except (IOError, KeyError):
                self.send_error(404)

            if path == 'rop.js':
                with open(os.path.join(CWD, 'payloads', 'debug_settings.bin')) as f:
                    content = f.read()
                thread = threading.Thread(target=netcat, args=(client, 9020, content))
                thread.daemon = True
                thread.start()
        else:
            self.send_error(403)

    def do_HEAD(self):
        self.send_response(200)
        self.send_header('Content-Length', '0')
        self.end_headers()

    # Silence SimpleHTTPServer in CLI
    def log_message(self, format, *args):
        return


def checkroot():
    """Checks if the user is root

       Returns True on Windows by default
       Returns: Boolean
    """
    try:
        root = os.getuid() == 0
    except AttributeError:
        root = True

    return root


def getlan():
    """Gets the computer's LAN IP

       Returns: String
    """
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        lan = str(s.getsockname()[0])
        s.close()
    except socket.error:
        s.close()
        sys.exit('>> Unable to find LAN IP')

    return lan


def getnetwork(ipaddr):
    """Guesses the private network based on the IP address

       Returns the default IPv4 route if it isn't a private network
       Returns: String
    """
    ipaddr = ipaddr.split('.')

    if ipaddr[0] == '10':
        network = '10.0.0.0/8'
    elif ipaddr[0] == '172' and 16 <= int(ipaddr[1]) <= 31:
        network = '172.16.0.0/12'
    elif ipaddr[0] == '192' and ipaddr[1] == '168':
        network = '192.168.0.0/16'
    else:
        print('WARNING: Could not figure out private network' + os.linesep +
              'WARNING: LAN blocking will NOT work')
        network = '0.0.0.0/0'

    return network


def checklan(ipaddr, network):
    """Checks to see if the IP address is contained within the network

       Returns: Boolean
    """
    ipaddr = socket.inet_aton(ipaddr)
    netaddr = network.split('/')[0]
    netmask = network.split('/')[1]
    netaddr = socket.inet_aton(netaddr)

    ipint = struct.unpack('!I', ipaddr)[0]
    netint = struct.unpack('!I', netaddr)[0]
    maskint = (0xffffffff << (32 - int(netmask))) & 0xffffffff

    return ipint & maskint == netint


def writeconf(lan):
    """Writes the configuration file for FakeDns

        Input:   IPv4 Address as String
        Returns: Boolean
    """
    exists = os.path.isfile(DNS_LOC)

    try:
        with open(DNS_LOC, 'w') as f:
            f.write('A manuals.playstation.net ' + lan + '\n')
            f.write('A update.playstation.net ' + lan + '\n')
            f.write('A d[a-z]{2}01.ps4.update.playstation.net ' + lan + '\n')
            f.write('A f[a-z]{2}01.ps4.update.playstation.net ' + lan + '\n')
            f.write('A h[a-z]{2}01.ps4.update.playstation.net ' + lan + '\n')
            f.write('A [0-9]{1,3}-[0-9]{1,3}-[0-9]{1,3}-[0-9]{1,3}-push.np.communication.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-evnt-edge.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-gcd.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-gmsg.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-ivt.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-ntl.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-prof.np.community.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}-push.np.communication.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}.np.stun.playstation.net 0.0.0.0\n')
            f.write('A [a-z]{2}[0-9]{4}-[a-z]{4}[0-9]{5}-[0-9]{2}.auth.np.ac.playstation.net 0.0.0.0\n')
            f.write('A a6.us.np.communication.playstation.net 0.0.0.0\n')
            f.write('A activity.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A activity01.ww.np.community.playstation.net 0.0.0.0\n')
            f.write('A api-p014.ribob01.net 0.0.0.0\n')
            f.write('A apicdn-p014.ribob01.net 0.0.0.0\n')
            f.write('A appinfo.dl.playstation.net 0.0.0.0\n')
            f.write('A artcdnsecure.ribob01.net 0.0.0.0\n')
            f.write('A asm.np.community.playstation.net 0.0.0.0\n')
            f.write('A auth.api.np.ac.playstation.net 0.0.0.0\n')
            f.write('A cfss.dunbar.scea.com 0.0.0.0\n')
            f.write('A commerce.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A commerce.np.ac.playstation.net 0.0.0.0\n')
            f.write('A commerce1.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A communication-polling.us.np.communication.playstation.net 0.0.0.0\n')
            f.write('A communities.api.playstation.com 0.0.0.0\n')
            f.write('A crepo.ww.dl.playstation.net 0.0.0.0\n')
            f.write('A csla.np.community.playstation.net 0.0.0.0\n')
            f.write('A ena.net.playstation.net 0.0.0.0\n')
            f.write('A event.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A f[a-z]{2}01.psp2.update.playstation.net 0.0.0.0\n')
            f.write('A friend-list-update.ww.np.communication.playstation.net 0.0.0.0\n')
            f.write('A friend-list-view.us.np.communication.playstation.net 0.0.0.0\n')
            f.write('A friendfinder.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A gen4.reports.tools.gos.ea.com 0.0.0.0\n')
            f.write('A get.net.playstation.net 0.0.0.0\n')
            f.write('A getprof.us.np.community.playstation.net 0.0.0.0\n')
            f.write('A gs-sec.ww.np.dl.playstation.net 0.0.0.0\n')
            f.write('A gs2-sec.ww.prod.dl.playstation.net 0.0.0.0\n')
            f.write('A image.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A legaldoc.dl.playstation.net 0.0.0.0\n')
            f.write('A livearea.np.dl.playstation.net 0.0.0.0\n')
            f.write('A native.np.ac.playstation.net 0.0.0.0\n')
            f.write('A nsx.np.dl.playstation.net 0.0.0.0\n')
            f.write('A nsx.sec.np.dl.playstation.net 0.0.0.0\n')
            f.write('A oqesn.np.dl.playstation.net 0.0.0.0\n')
            f.write('A post.net.playstation.net 0.0.0.0\n')
            f.write('A profile.[a-z]{2}.np.community.playstation.net 0.0.0.0\n')
            f.write('A ps4-eb.ww.np.dl.playstation.net 0.0.0.0\n')
            f.write('A ps4-system.sec.np.dl.playstation.net 0.0.0.0\n')
            f.write('A ps4.updptl.np.community.playstation.net 0.0.0.0\n')
            f.write('A ps4.updptl.sp-int.community.playstation.net 0.0.0.0\n')
            f.write('A ps4updptl.[a-z]{2}.np.community.playstation.net 0.0.0.0\n')
            f.write('A ps4updptl.[a-z]{2}.sp-int.community.playstation.net 0.0.0.0\n')
            f.write('A psn-rsc.prod.dl.playstation.net 0.0.0.0\n')
            f.write('A psp2-e.np.dl.playstation.net 0.0.0.0\n')
            f.write('A psp2.updptl.np.community.playstation.net 0.0.0.0\n')
            f.write('A resource.np.ac.playstation.net 0.0.0.0\n')
            f.write('A scei-0.auth.np.ac.playstation.net 0.0.0.0\n')
            f.write('A sf.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A sf.prod.sonyentertainmentnetwork.com 0.0.0.0\n')
            f.write('A smetrics.aem.playstation.com 0.0.0.0\n')
            f.write('A sn.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A static-resource.np.community.playstation.net 0.0.0.0\n')
            f.write('A t-prof.np.community.playstation.net 0.0.0.0\n')
            f.write('A theia.dl.playstation.net 0.0.0.0\n')
            f.write('A themis.dl.playstation.net 0.0.0.0\n')
            f.write('A tmdb.np.dl.playstation.net 0.0.0.0\n')
            f.write('A trophy01.np.community.playstation.net 0.0.0.0\n')
            f.write('A ugc.api.playstation.com 0.0.0.0\n')
            f.write('A video.dl.playstation.net 0.0.0.0\n')
            f.write('A vl.api.np.km.playstation.net 0.0.0.0\n')
            f.write('A zeke.scea.com 0.0.0.0\n')
        if not exists:
            fixpermissions()
        return True
    except IOError:
        return False


def fixpermissions():
    """Make FakeDNS config file the same permissions as start.py

       This should only be run if the config didn't exist before
       It will not include execution privileges
    """
    try:
        stats = os.stat(SCRIPT_LOC)

        os.chown(DNS_LOC, stats.st_uid, stats.st_gid)

        mask = oct(stats.st_mode & 0o777)
        newmask = ''

        for i in mask:
            if i != 'o':
                if int(i) % 2 != 0:
                    i = str(int(i) - 1)
            newmask += i

        mask = int(newmask, 8)
        os.chmod(DNS_LOC, mask)
    except AttributeError:
        pass
    except OSError:
        print('>> Unable to change permissions of ' + DNS_LOC + os.linesep +
              '   ^^ This is a non-fatal error ^^')


def startservers():
    """Start the DNS and HTTP Server"""
    try:
        dns = subprocess.Popen(['python', FAKE_LOC, '-c', DNS_LOC])
    except IOError:
        sys.exit('>> Unable to locate FakeDns')

    try:
        httpd = MyTCPServer(('', 80), MyHandler)
    except socket.error:
        dns.kill()
        sys.exit('>> Port 80 already in use')
    try:
        print('>> Starting HTTP Server...')
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.shutdown()
        httpd.server_close()
        dns.kill()
        sys.exit()


def netcat(hostname, port, content):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    timeout = time.time() + 60
    while True:
        result = s.connect_ex((hostname, port))
        if result == 0:
            print('>> Connected to PS4')
            timed_out = False
            break
        if time.time() >= timeout:
            print('>> Netcat service timed out')
            timed_out = True
            break
    if not timed_out:
        s.sendall(content)
        s.shutdown(socket.SHUT_WR)
        while 1:
            data = s.recv(1024)
            if not data:
                break
        print('>> Payload Sent!')
    s.close()


def main():
    """The main logic"""
    if not checkroot():
        sys.exit('>> This must be run by root as it requires port 53 & 80')

    lan = getlan()

    if writeconf(lan):
        print('>> Your DNS IP is ' + lan)
    else:
        sys.exit('>> Unable to write ' + DNS_LOC)

    startservers()


if __name__ == '__main__':
    main()
