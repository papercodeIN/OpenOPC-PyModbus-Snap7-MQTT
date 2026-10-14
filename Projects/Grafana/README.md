<h1 align = "center">🌟Grafana🌟</h1>
 
---
<p align="center">
  <span style="font-size: 1.1em; color: #FFD700; font-weight: bold;">✨ Enjoying this project? Support our work! ✨</span>
</p>

<p align="center" style="margin: 15px 0;">
  <a href="https://buymeacoffee.com/pylin" target="_blank">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" style="height: 40px; width: 150px;">
  </a>
</p>

<p align="center" style="margin: 15px 0;">
  <a href="https://www.youtube.com/channel/UCKKhdFV0q8CV5vWUDfiDfTw" target="_blank">
    <img src="https://img.shields.io/badge/SUBSCRIBE%20ON%20YOUTUBE-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Subscribe on YouTube" style="height: 40px;">
  </a>
</p>

---

- 🚀 [Download Grafana](https://grafana.com/grafana/download)

---


$\color{Green}\Huge{\textbf{Grafana Installation}}$

1. 🆓How to Download and Install Grafana Enterprise Edition in Windows Machine [[Watch]](https://youtu.be/wMfs0UqXD7Q)
2. 🆓How to Get Your Own Grafana Virtual Lab Instantly and Free from virtuallabs.online [[Watch]](https://youtu.be/2UmH1Bj8gDU)
3. 🆓How to Install and Run Grafana in Raspberry Pi [[Watch]](https://youtu.be/wycb13Esf88)
    
    ```bash
    #Source: https://grafana.com/grafana/download
    sudo apt-get install -y adduser libfontconfig1 musl
    wget https://dl.grafana.com/enterprise/release/grafana-enterprise_11.1.3_arm64.deb
    sudo dpkg -i grafana-enterprise_11.1.3_arm64.deb
    
    # ------------------------------- Method - 2 - Tested -------------------------------
    
    # Download the GPG key from Grafana's official repository, convert it to the appropriate format, and store it in the keyring directory.
    wget -O- https://packages.grafana.com/gpg.key | gpg --dearmor | sudo tee /usr/share/keyrings/grafana-archive-keyring.gpg >/dev/null
    
    # Add the Grafana APT repository to the sources list, using the signed key from the previous step for verification.
    echo "deb [signed-by=/usr/share/keyrings/grafana-archive-keyring.gpg] https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
    
    # Update the package lists to include the Grafana repository, then install Grafana.
    sudo apt update && sudo apt install -y grafana
    
    # Remove any previous masking on the Grafana server service to allow it to be started.
    sudo systemctl unmask grafana-server.service
    
    # Start the Grafana server service immediately.
    sudo systemctl start grafana-server
    
    # Enable the Grafana server service to start automatically on boot.
    sudo systemctl enable grafana-server.service
    
    # Enable the Grafana server service, similar to the previous command (redundant but ensures it's enabled).
    sudo systemctl enable grafana-server
    
    # Check the current status of the Grafana server service to ensure it's running correctly.
    sudo systemctl status grafana-server.service
    
    # This command is an alternative way to start the Grafana server service manually.
    sudo /bin/systemctl start grafana-server
    ```
    
4. 🆓How to Run Grafana in Docker using Virtuallabs.Online [[Watch]](https://youtu.be/JG-4Bq0A27o)
    
    ```docker
    docker run -d -p 3000:3000 --name=grafana grafana/grafana-enterprise
    ```
    

##

$\color{Green}\Huge{\textbf{Grafana + MQTT}}$
1. 🆓How to Add and Configure MQTT Data Source in Grafana and Connect with HiveMQ Free Could MQTT Broker [[Watch]](https://youtu.be/fS7QSpTYpvM)
2. 🆓How to Create Grafana Dashboard for RAW MQTT Payloads using HiveMQ Free Cloud MQTT Broker [[Watch]](https://youtu.be/XXUimXvYOuk)

---

<h1 align="center">📢 Reach Out to Us for Any Queries ⤵️</h1>

<table align="center">
  <thead>
    <tr>
      <th>📞 Contact Method</th>
      <th>🔗 Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Call / WhatsApp</td>
      <td><a href="https://wa.me/919974477759">+91-9974477759</a></td>
    </tr>
    <tr>
      <td>Telegram</td>
      <td><a href="https://t.me/fusionautomate">@fusionautomate</a></td>
    </tr>
    <tr>
      <td>Email</td>
      <td><a href="mailto:eng.innovativ@gmail.com">eng.innovativ@gmail.com</a></td>
    </tr>
  </tbody>
</table>

---