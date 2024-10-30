
import argparse
import sys


class ArgumentParser(argparse.ArgumentParser):
    def error(self, message):
        self.print_help(sys.stderr)
        self.exit(1, None)


def main(src_dir, dst_ip, dst_port):
    pass


if __name__ == '__main__':
    parser = ArgumentParser(description='PCAP files upload-agent')
    parser.add_argument('src', type=str, help='Path to target directory with PCAP files')
    parser.add_argument('dst_ip', type=str, help='Remote server IP-address')
    parser.add_argument('dst_port', type=int, help='Remote server port')
    args = parser.parse_args()
    main(args.src, args.dst_ip, args.dst_port)
