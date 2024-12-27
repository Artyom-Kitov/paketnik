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

export interface HttpInfo {
  method: string;
  url: string;
  statusCode: number;
  headers: Map<string, string>;
  body: string;
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
  httpInfo: HttpInfo;
  tags: string[];
  index: number;
  httpInfo: HttpInfo;
}

export interface HttpInfo {
  method: string;
  url: string;
  statusCode: number;
  headers: Map<string, string>;
  body: string;
}

export interface UnallocatedPacket {
  id: string;
  packet: Packet;
}

export interface Pcap {
  id: string;
  content: Blob;
}

export interface ExportedRequest {
  export: string;
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
export interface SearchRequest {
  filename: string;
  regex: string;
}

export interface SearchMatch {
  packet: number;
  string: string;
  offset: number;
}

export interface SearchResult {
  matches: SearchMatch[];
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

export async function getRequest(
  streamId: string,
  packetIndex: number,
  format: string,
): Promise<ExportedRequest> {
  return await fetchData<ExportedRequest>(
    "/streams/export-request?streamId=" +
      streamId +
      "&packetIndex=" +
      packetIndex +
      "&format=" +
      format,
    "GET",
    "",
  );
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

export async function getSearchResults(
  searchRequest: SearchRequest,
): Promise<SearchResult> {
  return await fetchData<SearchResult>("/search", "POST", searchRequest);
}

async function fetchData<Type>(
  path: string,
  method: string,
  body: Service | Rule | Pcap | string | Blob | SearchRequest,
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
    if (method == "DELETE" || (path == "/rules" && method == "POST")) {
      return (await fetch(host + path, options)) as Type;
    } else {
      const result = await fetch(host + path, options);
      if (result.status == 200) {
        return result.json() as Type;
      } else if (result.status == 500 && path == "/minio-api/upload/remote") {
        return result as Type;
      } else if (result.status == 500) {
        throw new Error("Server error");
      } else if (result.status == 404 && path == "/search") {
        throw new Error("Pcap not found");
      } else if (result.status == 204 && path == "/search") {
        throw new Error("No matches");
      } else if (result.status == 400 && path.startsWith("/rules/")) {
        throw new Error("Bad request: regex is invalid");
      } else if (result.status == 404 && path.startsWith("/rules/")) {
        throw new Error("Rule not found");
      } else if (result.status == 400) {
        throw new Error("Bad Request");
      } else if (result.status == 404) {
        throw new Error("Not Found");
      } else if (result.status == 409 && path == "/minio-api/upload/remote") {
        throw new Error("File already exist");
      }
      return result as Type;
    }
  } catch (error) {
    const errorMessage: string =
      "An error occurred: " + (error as Error).message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
