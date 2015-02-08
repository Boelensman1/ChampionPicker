#!/usr/bin/python

import sys
import getopt
import urllib2
import json
import os

free2playURL = "https://%s.api.pvp.net/api/lol/%s/v1.2/champion?freeToPlay=true&api_key="
regions = ["BR", "EUNE", "EUW", "KR", "LAN", "LAS", "NA", "OCE" ,"RU", "TR"]

def main(argv):
    apikey = ''
    outpath= ''
    try:
        opts, args = getopt.getopt(argv, ["a:","o:"], ["apikey=","outpath="])
    except getopt.GetoptError:
        print 'Usage: test.py --apikey=<apikey> --outpath=<outpath>'
        sys.exit(2)
    for opt, arg in opts:
        if opt in ("-a", "--apikey"):
            apikey = arg
        elif opt in ("-o", "--outpath"):
            outpath = arg
    if apikey == '':
        print 'Missing argument apikey!\nUsage: test.py --apikey=<apikey> --outpath=<outpath>'
    elif outpath=='':
        print 'Missing argument outpath!\nUsage: test.py --apikey=<apikey> --outpath=<outpath>'
    else:
        # everything is OK, load previous
        output = {'free2play':{},'errors':{}}
        errors = {}
        if os.path.isfile(outpath):
            f = open(outpath, 'r')
            output = json.loads(f.read())

        #load new
        for region in regions:
            req = urllib2.Request(free2playURL % (region, region) + apikey)
            try:
                free2playJSON = urllib2.urlopen(req)
            except urllib2.HTTPError as e:
                print 'Error while requesting', region
                print 'The server couldn\'t fulfill the request.'
                print 'Error code: ', e.code
                output['errors'][region]=True
            except urllib2.URLError as e:
                print 'Error while requesting', region
                print 'We failed to reach a server.'
                print 'Reason: ', e.reason
                output['errors'][region]=True
            else:
                free2playJSON = json.loads(free2playJSON.read())
                #now lets remove all unnecessary information
                free2playReal = [];
                for champion in free2playJSON['champions']:
                    free2playReal.append(champion['id'])
                output['free2play'][region] = free2playReal

                #no error
                output['errors'][region]=False

        #and safe
        with open(outpath, 'w') as outfile:
            json.dump(output, outfile)


if __name__ == "__main__":
    main(sys.argv[1:])