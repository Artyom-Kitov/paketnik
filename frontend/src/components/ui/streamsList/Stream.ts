export type Stream = {
  id: number;
  serviceName: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  protocol: string;
  startTime: string;
  duration: string;
  up: string;
  down: string;
  rules: string[];
  headers: {
    ethernet: {
      srcMac: string;
      destMac: string;
    };
    ip: {
      version: number;
      packetLength: number;
      flags: { doNotFragment: number; moreFragments: number };
      fragmentOffset: number;
      ttl: number;
      protocol: string;
      headerChecksum: string;
      srcIp: string;
      destIp: string;
    };
    tcp: {
      srcPort: number;
      destPort: number;
      sequenceNumber: number;
      ackNumber: number;
      dataOffset: number;
      flags: { SYN: boolean; ACK: boolean; FIN: boolean };
      windowSize: number;
      checksum: string;
      urgentPointer: number;
      payload: string;
    };
  };
};
