
import argparse
import sys
import pathlib
import logging
import traceback

import dpkt

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger()


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help(sys.stderr)
        self.exit(1, None)


def main(src_dir: str, dst_ip: str, dst_port: int, upload_last_pcap: bool):
    src_dir = pathlib.Path(src_dir)
    
    if not src_dir.is_absolute():
        src_dir = pathlib.Path.cwd() / src_dir
    logger.info(f'Source dir is: {src_dir}')
    
    if not src_dir.exists():
        logger.critical(f'Target directory "{src_dir}" does not exists')
        return

    pcaps = list(src_dir.glob('*.pcap'))

    valid_pcaps = []
    for pcap in pcaps:
        try:
            reader = dpkt.pcap.Reader(open(pcap, 'rb'))
        except Exception as err:
            logger.warning(f'File "{pcap}" skipped due to file reading error')
            logger.debug(f'{traceback.format_exc()}')
        else:
            valid_pcaps.append(pcap)

    for pcap in valid_pcaps:
        print(pcap)
    


if __name__ == '__main__':
    parser = ArgumentParser(description='PCAP-files upload-agent')
    parser.add_argument('src', type=str, help='path to target directory with PCAP-files')
    parser.add_argument('dst_ip', type=str, help='remote server IP-address')
    parser.add_argument('dst_port', type=int, help='remote server port')
    parser.add_argument('--upload-last', dest='upload_last', action='store_true', help='upload the last added PCAP-file')
    args = parser.parse_args()
    main(args.src, args.dst_ip, args.dst_port, args.upload_last)
