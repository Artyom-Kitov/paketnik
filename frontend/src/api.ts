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
  return await fetchData(host + "/services/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });
}

export async function deleteService(id: string): Promise<void> {
  return await fetchData(host + "/service/" + id, {
    method: "DELETE",
  });
}

export async function postService(service: Service): Promise<void> {
  return await fetchData(host + "/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(service),
  });
}

async function fetchData(input: string, init: RequestInit): Promise<void> {
  return await fetch(input, init)
    .then((response) => response.json())
    .then(({ success }) => {
      if (!success) {
        throw new Error("An error occured");
      }
    });
}
