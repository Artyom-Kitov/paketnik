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

export interface Pcap {
  id: string;
  content: Blob;
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

export async function getPcapById(id: string): Promise<Pcap> {
  const response = await fetchData<{ content: Blob }>(
    "/minio-api/files/" + id,
    "GET",
    "",
  );
  const pcapFile: Pcap = {
    id: id,
    content: response.content,
  };
  return pcapFile;
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

async function fetchData<Type>(
  path: string,
  method: string,
  body: Service | Rule | Pcap | string | Blob,
  fileName?: string,
): Promise<Type> {
  let options = {};
  if (method == "GET" || method == "DELETE") {
    options = { method: method };
  } else if (body instanceof Blob) {
    const formData = new FormData();
    formData.append("files", body, fileName);
    options = {
      method: method,
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
      console.log("aboba");
      return (await fetch(host + path, options)) as Type;
    } else {
      return (await fetch(host + path, options)).json() as Type;
    }
  } catch (error) {
    const errorMessage: string =
      "An error occured: " + (error as Error).message;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
}
