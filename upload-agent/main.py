
import argparse
import sys
import pathlib
import logging
import traceback
import datetime
import os

import dpkt
import watchdog.events
import watchdog.observers


class PcapsAutoUploader(watchdog.events.FileSystemEventHandler):
    def __init__(self, src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
        self._src_dir = src_dir
        self._dst_ip = dst_ip
        self._dst_port = dst_port
        self._upload_last_pcap = upload_last_pcap

    def on_created(self, event):
        if event.is_directory:
            return
        upload_pcaps(self._src_dir, self._dst_ip, self._dst_port, self._upload_last_pcap)

    def on_moved(self, event):
        if event.is_directory:
            return
        upload_pcaps(self._src_dir, self._dst_ip, self._dst_port, self._upload_last_pcap)


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help(sys.stderr)
        self.exit(1, None)


def is_uploaded(path_to_pcap: str):
    return False


def upload_pcap(path_to_pcap: str, dst_ip: str, dst_port: int):
    try:
        with open(path_to_pcap.encode('utf-8'), 'rb') as file:
            pcaps = dpkt.pcap.Reader(file).readpkts()
    except Exception as err:
        logger.warning(f'File \"{path_to_pcap}\" skipped due to file reading error')
        logger.debug(f'{traceback.format_exc()}')
        return False
    else:
        # TODO: Upload pcap
        pass
    return True


def upload_pcaps(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
    pcaps = src_dir.glob('*.pcap')
    pcaps = sorted(pcaps, key=lambda x: datetime.datetime.fromtimestamp(os.path.getmtime(x)))
                   
    if not upload_last_pcap and pcaps:
        last_pcap = pcaps.pop()
        logger.info(f'File {last_pcap} skipped as last added file')

    count = 0
    for path_to_pcap in pcaps:
        if is_uploaded(path_to_pcap):
            continue
        if upload_pcap(str(path_to_pcap), dst_ip, dst_port):
            count += 1
    logger.info(f'{count} files uploaded')


def main(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
    src_dir = pathlib.Path(src_dir)
    
    if not src_dir.is_absolute():
        src_dir = pathlib.Path.cwd() / src_dir
    logger.info(f'Source dir is: {src_dir}')
    
    if not src_dir.exists():
        logger.critical(f'Target directory "{src_dir}" does not exists')
        return

    uploader = PcapsAutoUploader(src_dir, dst_ip, dst_port, upload_last_pcap)
    observer = watchdog.observers.Observer()
    observer.schedule(uploader, src_dir, recursive=False)
    observer.start()
    
    upload_pcaps(src_dir, dst_ip, dst_port, upload_last_pcap)
    
    try:
        while observer.is_alive():
            observer.join(1)
    except KeyboardInterrupt:
        logger.info('Shutdown...')
        observer.stop()
    observer.join()      


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
