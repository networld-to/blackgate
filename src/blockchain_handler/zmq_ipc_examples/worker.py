import sys
import os
import time
import zmq
import random

def consumer():
    consumer_id = random.randrange(1,10005)
    print "I am consumer #%s" % (consumer_id)
    sys.stdout.flush()
    context = zmq.Context()

    # recieve work
    consumer_receiver = context.socket(zmq.PULL)
    consumer_receiver.connect(os.environ["SOCKET"])

    while True:
        work = consumer_receiver.recv()
        print "[>>] python worker: " + work
        sys.stdout.flush()

consumer()
