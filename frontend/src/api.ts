const host: string = "http://localhost:8081";

export interface Service {
  id: string;
  name: string;
  port: number;
  hexColor: string;
}

export async function getServices(): Promise<Service[]> {
  return await fetchData<Service[]>("/services", "GET", "");
}

export async function updateService(service: Service): Promise<void> {
  return await fetchData<void>("/services/", "PUT", service);
}

export async function deleteService(id: string): Promise<void> {
  return await fetchData<void>("/service/" + id, "DELETE", "");
}

export async function postService(service: Service): Promise<void> {
  return await fetchData<void>("/services", "POST", service);
}

async function fetchData<Type>(
  path: string,
  method: string,
  body: Service | string,
): Promise<Type> {
  let options = {};
  if(method == "GET" || method == "DELETE"){
    options = {method: method}
  } else{
    options = {    
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),}
  }
  return await fetch(host + path, options)
    .then((response) => response.json())
    .then(({ success }) => {
      if (!success) {
        throw new Error("An error occured");
      }
    }) as Type;
}
