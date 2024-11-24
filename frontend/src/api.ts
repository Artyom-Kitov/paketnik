const host: string = "http://localhost:8081";

export interface Service {
  id: string;
  name: string;
  port: number;
  hexColor: string;
}

export async function getServices(): Promise<Service[]> {
  return await fetch(host + "/services").then((response) => response.json());
}

export async function updateService(service: Service): Promise<void> {
  return await fetchData(host + "/services/", "PUT", JSON.stringify(service));
}

export async function deleteService(id: string): Promise<void> {
  return await fetchData(host + "/service/" + id, "DELETE", "");
}

export async function postService(service: Service): Promise<void> {
  return await fetchData(host + "/services", "POST", JSON.stringify(service));
}

async function fetchData(
  path: string,
  method: string,
  body: string,
): Promise<void> {
  return await fetch(path, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  })
    .then((response) => response.json())
    .then(({ success }) => {
      if (!success) {
        throw new Error("An error occured");
      }
    });
}
