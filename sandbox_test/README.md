# Paketnik sandbox testing

## Requirements: 
- Docker 
- Python

## Steps 
### 1. Build paketnik:
`docker compose up --build`

### 2. Create some sample services via python script 
`python3 create_services.py`


*Note: you can delete them using other script:*
`python3 delete_all_services.py`

### 3. Upload your PCAP files:
`python3 upload_pcap.py <filename>`

### 4. Analyze PCAP 
Visit *localhost:8080* and see.



## Sample PCAP generation 

### 1. Start sample python server on a desired port 
`python3 -m http.server <port>`

### 2. Dump traffic on selected port to PCAP
`sudo tcpdump -i any port <port> -w <filename>.pcap`

### 3. Upload to Paketnik:
`python3 upload_pcap.py <filename>.pcap`
