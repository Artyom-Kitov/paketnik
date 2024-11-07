
import argparse
import sys
import pathlib
import logging
import traceback
import datetime
import os
import time
import base64

import dpkt
import requests

PCAPS_LIST_STORAGE = '.storage.txt'
TIMEOUT = 1


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help(sys.stderr)
        self.exit(1, None)


class PcapsStorage:
    def __init__(self, filepath: str):
        self._filepath = filepath
        self._processed = set()
        self._uploaded = set()
        self._failed = set()

        self._load()

    def is_processed(self, pcap: str) -> bool:
        return pcap in self._processed

    def is_uploaded(self, pcap: str) -> bool:
        return pcap in self._uploaded

    def is_failed(self, pcap: str) -> bool:
        return pcap in self._failed

    def mark_processed(self, pcap: str) -> None:
        self._processed.add(pcap)

    def mark_uploaded(self, pcap: str) -> None:
        self._uploaded.add(pcap)
        with open(self._filepath, 'a') as file:
            file.write(f'{pcap}\n')

    def mark_failed(self, pcap: str) -> None:
        self._failed.add(pcap)

    def _load(self) -> None:
        if not pathlib.Path(self._filepath).exists():
            pathlib.Path(self._filepath).touch()
            return
        with open(self._filepath, 'r') as file:
            pcaps = [line.strip('\n') for line in file]
        self._uploaded = set(pcaps)


class upload_in_chunks(object):
    def __init__(self, filename: str, chunksize: int = 1 << 13):
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
                sys.stdout.write('\r{p:3.0f}% {f}'.format(p=percent, f=self._filename))
                yield data
    
    def __len__(self):
        return self._totalsize


def upload_pcap(path_to_pcap: str, dst_ip: str, dst_port: int) -> bool:
    try:
        with open(path_to_pcap, 'rb') as file:
            pcaps = dpkt.pcap.Reader(file).readpkts()
    except Exception as err:
        logger.error(f'File \"{path_to_pcap}\" skipped due to file parsing error')
        logger.debug(f'{traceback.format_exc()}')
        return False
    
    url = f'http://{dst_ip}:{dst_port}'
    headers = {'X-File-Name': path_to_pcap.encode('utf-8').hex()}
    
    logger.info(f'{path_to_pcap} transfer started')
            
    t_start = time.time()
    try:
        response = requests.post(url, data=upload_in_chunks(path_to_pcap), headers=headers, timeout=TIMEOUT)
    except Exception as err:
        logger.error(f'{path_to_pcap} transfer failed with error')
        logger.debug(f'{traceback.format_exc()}')
        return False
    t_end = time.time()
            
    if response.status_code != 200:
        logger.error(f'{path_to_pcap}: error status code ({response.status_code})')
        return False

    logger.info(f'{path_to_pcap} transfer completed in {t_end-t_start:.3} s')
    return True


def upload_pcaps(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool) -> None:
    pcaps = src_dir.glob('*.pcap')
    pcaps = sorted(pcaps, key=lambda x: datetime.datetime.fromtimestamp(os.path.getmtime(x)))
    
    if not upload_last_pcap and pcaps:
        last_pcap = pcaps.pop()
        if storage.is_processed(last_pcap):
            logger.info(f'File {last_pcap} skipped as last added file')
            storage.mark_processed(last_pcap)

    count = 0
    for path_to_pcap in map(str, pcaps):
        if storage.is_processed(path_to_pcap):
            continue
        storage.mark_processed(path_to_pcap)

        if storage.is_uploaded(path_to_pcap):
            logger.info(f'File {path_to_pcap} skipped as already uploaded')
            continue
        
        if upload_pcap(str(path_to_pcap), dst_ip, dst_port):
            storage.mark_uploaded(path_to_pcap)
            count += 1
        else:
            storage.mark_failed(path_to_pcap)
    
    if count:
        logger.info(f'{count} / {len(pcaps)} pcaps uploaded')
    return


def main(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool) -> None:
    src_dir = pathlib.Path(src_dir).resolve()
    
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
    parser.add_argument('--debug', dest='log_debug', action='store_true', help='set DEBUG log level (instead of INFO)')
    args = parser.parse_args()

    if args.log_debug:
        logging.basicConfig(level=logging.DEBUG, format='%(asctime)s %(levelname)s %(message)s')
    else:
        logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
    logger = logging.getLogger()

    storage = PcapsStorage(PCAPS_LIST_STORAGE)
    
    main(args.src, args.dst_ip, args.dst_port, args.upload_last)
