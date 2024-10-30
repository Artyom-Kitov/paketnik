
import argparse
import sys
import pathlib
import logging
import traceback
import datetime
import os
import time

import dpkt
import requests
import tqdm


processed_pcaps = set()
uploaded_pcaps = set()
error_pcaps = set()


class upload_in_chunks(object):
    def __init__(self, filename, chunksize=1 << 13):
        self._filename = filename
        self._chunksize = chunksize
        self._totalsize = os.path.getsize(filename)
        self._readsofar = 0

    def __iter__(self):
        with open(self._filename, 'rb') as file:
            while True:
                data = file.read(self._chunksize)
                if not data:
                    sys.stdout.write('\n')
                    break
                self._readsofar += len(data)
                percent = self._readsofar * 1e2 / self._totalsize
                sys.stdout.write('\r{percent:3.0f}% {filename}'.format(percent=percent, filename=self._filename))
                yield data
    
    def __len__(self):
        return self._totalsize


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help(sys.stderr)
        self.exit(1, None)


def upload_pcap(path_to_pcap: str, dst_ip: str, dst_port: int):
    try:
        with open(path_to_pcap, 'rb') as file:
            pcaps = dpkt.pcap.Reader(file).readpkts()
    except Exception as err:
        logger.warning(f'File \"{path_to_pcap}\" skipped due to file parsing error')
        logger.debug(f'{traceback.format_exc()}')
        return False
    else:
        with open(path_to_pcap, 'rb') as file:
            url = f'http://{dst_ip}:{dst_port}'
            r = requests.post(url, data=upload_in_chunks(path_to_pcap))
    return True


def upload_pcaps(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
    pcaps = src_dir.glob('*.pcap')
    pcaps = sorted(pcaps, key=lambda x: datetime.datetime.fromtimestamp(os.path.getmtime(x)))
    
    if not upload_last_pcap and pcaps:
        last_pcap = pcaps.pop()
        if last_pcap not in processed_pcaps:
            logger.info(f'File {last_pcap} skipped as last added file')
            processed_pcaps.add(last_pcap)

    count = 0
    for path_to_pcap in pcaps:
        if path_to_pcap in processed_pcaps:
            continue
        processed_pcaps.add(path_to_pcap)
        
        if upload_pcap(str(path_to_pcap), dst_ip, dst_port):
            uploaded_pcaps.add(path_to_pcap)
            count += 1
        else:
            error_pcaps.add(path_to_pcap)
        
    if count:
        logger.info(f'{count} pcaps uploaded')
    return


def main(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
    src_dir = pathlib.Path(src_dir)
    
    if not src_dir.is_absolute():
        src_dir = pathlib.Path.cwd() / src_dir
    logger.info(f'Source dir is: {src_dir}')
    
    if not src_dir.exists():
        logger.critical(f'Target directory "{src_dir}" does not exists')
        return
    
    try:
        while True:
            upload_pcaps(src_dir, dst_ip, dst_port, upload_last_pcap)
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info('Shutdown...')
    return


if __name__ == '__main__':
    parser = ArgumentParser(description='PCAP-files upload-agent')
    parser.add_argument('src', type=str, help='path to target directory with PCAP-files')
    parser.add_argument('dst_ip', type=str, help='remote server IP-address')
    parser.add_argument('dst_port', type=int, help='remote server port')
    parser.add_argument('--upload-last', dest='upload_last', action='store_true', help='upload the last added PCAP-file')
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    logger = logging.getLogger()

    main(args.src, args.dst_ip, args.dst_port, args.upload_last)
