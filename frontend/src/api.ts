const host: string = "http://localhost:8081";

export interface Service {
  id: string;
  name: string;
  port: number;
  hexColor: string;
}

export interface Rule {
  id: string;
  name: string;
  type: string;
  regex: string;
  scope: string;
}

export interface Stream {
  id: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  pcapId: string;
}

export interface Ethernet {
  srcMac: string;
  dstMac: string;
}

export interface Ipv4 {
  version: string;
  length: number;
  doNotFragment: boolean;
  moreFragments: boolean;
  fragmentOffset: number;
  ttl: number;
  headerChecksum: number;
  srcIp: string;
  dstIp: string;
}

export interface Tcp {
  srcPort: number;
  dstPort: number;
  sequenceNumber: number;
  ackNumber: number;
  dataOffset: number;
  cwr: boolean;
  ece: boolean;
  urg: boolean;
  ack: boolean;
  psh: boolean;
  rst: boolean;
  syn: boolean;
  fin: boolean;
  windowSize: number;
  checksum: string;
  urgentPointer: number;
  payload: string;
}

export interface Udp {
  srcPort: number;
  dstPort: number;
  length: number;
  checksum: number;
  data: string;
}

export interface Packet {
  receivedAt: string;
  encodedData: string;
  layers: {
    ethernet: Ethernet;
    ipv4: Ipv4;
    tcp: Tcp;
    udp: Udp;
  };
  tags: string[];
}

export interface UnallocatedPacket {
  id: string;
  packet: Packet;
}

export interface Pcap {
  id: string;
  content: Blob;
}

export async function postPcapRemote(pcap: Pcap): Promise<void> {
  return await fetchData<void>(
    "/minio-api/upload/remote",
    "POST",
    pcap.content,
    pcap.id,
  );
}

export async function postPcapLocal(pcap: Pcap): Promise<void> {
  return await fetchData<void>(
    "/minio-api/upload/local",
    "POST",
    pcap.content,
    pcap.id,
  );
}

export async function postBucket(pcap: Pcap): Promise<void> {
  return await fetchData<void>("/minio-api/create-bucket", "POST", pcap);
}

export async function getPcap(): Promise<Pcap[]> {
  const response = await fetchData<{ [key: string]: string[] }>(
    "/minio-api/get-files",
    "GET",
    "",
  );
  const pcapFiles: Pcap[] = Object.values(response)
    .flat()
    .map((fileName) => ({
      id: fileName,
      content: new Blob(),
    }));
  return pcapFiles;
}

export async function deletePcap(id: string): Promise<void> {
  return await fetchData<void>("/minio-api/files/" + id, "DELETE", "");
}

export async function getRules(): Promise<Rule[]> {
  return await fetchData<Rule[]>("/rules", "GET", "");
}

export async function updateRule(rule: Rule): Promise<void> {
  return await fetchData<void>("/rules/" + rule.id, "PUT", rule);
}

export async function deleteRule(id: string): Promise<void> {
  return await fetchData<void>("/rules/" + id, "DELETE", "");
}

export async function postRule(rule: Rule): Promise<Response> {
  return await fetchData<Response>("/rules", "POST", rule);
}

export async function getServices(): Promise<Service[]> {
  return await fetchData<Service[]>("/services", "GET", "");
}

export async function updateService(service: Service): Promise<void> {
  return await fetchData<void>("/services/", "PUT", service);
}

export async function deleteService(id: string): Promise<void> {
  return await fetchData<void>("/services/" + id, "DELETE", "");
  return await fetchData<void>("/services/" + id, "DELETE", "");
}

export async function postService(service: Service): Promise<void> {
  return await fetchData<void>("/services", "POST", service);
}

export async function getStreams(): Promise<Stream[]> {
  return await fetchData<Stream[]>("/streams/infos", "GET", "");
}

export async function getPackets(id: string): Promise<Packet[]> {
  return await fetchData<Packet[]>("/streams/packets?id=" + id, "GET", "");
}

export async function getUnallocatedPackets(): Promise<UnallocatedPacket[]> {
  return await fetchData<UnallocatedPacket[]>(
    "/streams/unallocated",
    "GET",
    "",
  );
}

async function fetchData<Type>(
  path: string,
  method: string,
  body: Service | Rule | Pcap | string | Blob,
  fileName?: string,
): Promise<Type> {
  let options = {};
  if (method === "GET" || method === "DELETE") {
    options = { method: method };
  } else if (body instanceof Blob) {
    const formData = new FormData();
    formData.append("file", body, fileName);
    options = {
      method: method,
      headers: {
        "X-File-Name": fileName,
      },
      body: formData,
    };
  } else {
    options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  }
  try {
    if (
      method == "DELETE" ||
      (path == "/rules" && method == "POST") ||
      path == "/minio-api/upload/remote"
    ) {
      return (await fetch(host + path, options)) as Type;
    } else {
      return (await fetch(host + path, options)).json() as Type;
    }
  } catch (error) {
    const errorMessage: string =
      "An error occurred: " + (error as Error).message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
