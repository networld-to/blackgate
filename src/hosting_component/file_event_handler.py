import sys
import time
import logging
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler
from watchdog.events import FileSystemEventHandler
import shutil
import hashlib
from flask import Flask


class MyEventHandler(FileSystemEventHandler):

    def hash_file(self,filename):
        """"This function returns the SHA-1 hash of the file passed into it"""
        # make a hash object
        h = hashlib.sha256() # open file for reading in binary mode with
        with open(filename,'rb') as file: # loop till the end of the file
            chunk = 0
            while chunk != b'': # read only 1024 bytes at a time
                chunk = file.read(1024)
                h.update(chunk) # return the hex representation of digest
        return h.hexdigest()

    def on_created(self, event):
        if event.is_directory:
            print(event.src_path)
            print("creating archive")
            file = event.src_path.split("/")[-1]
            shutil.make_archive(file, 'zip', event.src_path)
            message = self.hash_file(file+'.zip')
            print(message)
            app = Flask(__name__,static_url_path='', static_folder=event.src_path)

            app.run(port=12345)



if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    path = sys.argv[1] if len(sys.argv) > 1 else '.'
    event_handler = MyEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
