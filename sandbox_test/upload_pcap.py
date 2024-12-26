import sys
import requests

def upload_file(file_path):
    url = "http://127.0.0.1:8080/api/minio-api/upload/remote"
    # just in case:
    # url = "http://127.0.0.1:8081/minio-api/upload/remote"
    headers = {
        "accept": "*/*",
        "X-File-Name": file_path.split("/")[-1], 
    }
    files = {
        "file": (file_path.split("/")[-1], open(file_path, "rb"), "application/vnd.tcpdump.pcap")
    }

    try:
        response = requests.post(url, headers=headers, files=files)

        print(f"HTTP status code: {response.status_code}")
        print(f"Server response: {response.text}")

        if response.status_code == 200:
            print("Success!")
        else:
            print(f"Error: {response.status_code}")
    except FileNotFoundError:
        print(f"File {file_path} not found.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        files["file"][1].close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload.py <file_path>")
    else:
        file_path = sys.argv[1]
        upload_file(file_path)
