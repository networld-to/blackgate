#!/bin/bash
../node_modules/.bin/nf start producer=1,node_worker=3,python_worker=2
rm zmq_pipeline.socket
