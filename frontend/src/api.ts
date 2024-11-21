const host: string = "http://localhost:8081";

export interface Service{
    id: string;
    name: string;
    port: number;
    hexColor: string;
}

export async function getServices(): Promise<Service[]> {
    return fetch(host + "/services")
    .then((response) => response.json())
}

export async function updateService(service: Service): Promise<void>{
    return fetch(host + "/services/" + service.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(service)
      })
      .then((response) => response.json())
      .then(({ success}) => {
        if (!success) {
          throw new Error("An error occured")
        }
      })

}

export async function deleteService(id: string): Promise<void>{
    return fetch(host + "/service/" + id, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .then(({ success, message }) => {
        if (!success) {
          throw new Error(message);
        }
  
        alert(message);
      })
}


export async function postService(service: Service): Promise<void>{
    return fetch(host + "/services", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: service.name,
            hexColor: service.hexColor,
            port: service.port
        })
      })
      .then((response) => response.json())
      .then(({ success}) => {
        if (!success) {
          throw new Error("An error occured")
        }
      })

}
