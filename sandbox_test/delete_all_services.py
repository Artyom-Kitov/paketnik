import requests

get_url = 'http://127.0.0.1:8080/api/services'
response = requests.get(get_url)

if response.status_code == 200:
    services = response.json()

    for service in services:
        service_id = service['id']
        delete_url = f'http://127.0.0.1:8080/api/services?id={service_id}'
        headers = {
            'accept': '*/*'
        }
        delete_response = requests.delete(delete_url, headers=headers)
        
        if delete_response.status_code != 200:
            print(f'Failed to delete service with ID: {service_id}. Status code: {delete_response.status_code}')
else:
    print(f'Failed to fetch services. Status code: {response.status_code}')
