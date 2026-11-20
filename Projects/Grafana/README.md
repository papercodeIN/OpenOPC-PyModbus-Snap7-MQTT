# 📊 Grafana Training Guide

Follow the training stages to set up Grafana and build a dashboard for MQTT data.

> 💡 **Choose a current setup option from Stages 1, 3, or 4.** Stage 2 is included as a historical guide; the VirtualLabs.online service shown in that video is no longer available. Then continue to Stages 5 and 6 to connect MQTT and create a dashboard.

## 🎓 Training stages

| Stage | Training topic | What you'll learn | Video |
| --- | --- | --- | --- |
| 1 🪟 | Install Grafana on Windows | Install Grafana Enterprise and open it in your browser. | [Watch](https://youtu.be/8rpYQ_75RLA) |
| 2 🕰️ | VirtualLabs.online Grafana lab *(no longer available)* | Historical guide: the service shown in this video has shut down. | [Watch](https://youtu.be/zPDlhDiHpsk) |
| 3 🍓 | Install Grafana on Raspberry Pi | Install and run Grafana on a Raspberry Pi. | [Watch](https://youtu.be/TmrXhgPzIMI) |
| 4 🐳 | Run Grafana in Docker with VirtualLabs | Run Grafana using a Docker-ready virtual server. | [Watch](https://youtu.be/C5YszoFLkyg) |
| 5 🔌 | Connect Grafana to HiveMQ Cloud | Add and configure an MQTT data source. | [Watch](https://youtu.be/txvFMnCp98Q) |
| 6 📈 | Create an MQTT dashboard | Display raw MQTT payloads in a Grafana dashboard. | [Watch](https://youtu.be/5O9I_r6oJhM) |

## 🍓 Raspberry Pi installation commands

Run these commands on your Raspberry Pi. The APT repository method was tested.

```bash
# Method 1: Install Grafana Enterprise from the ARM64 package
sudo apt-get install -y adduser libfontconfig1 musl
wget https://dl.grafana.com/enterprise/release/grafana-enterprise_11.1.3_arm64.deb
sudo dpkg -i grafana-enterprise_11.1.3_arm64.deb

# Method 2: Install Grafana from the APT repository (tested)
wget -O- https://packages.grafana.com/gpg.key | gpg --dearmor | sudo tee /usr/share/keyrings/grafana-archive-keyring.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/grafana-archive-keyring.gpg] https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update && sudo apt install -y grafana
sudo systemctl unmask grafana-server.service
sudo systemctl start grafana-server
sudo systemctl enable grafana-server.service
sudo systemctl enable grafana-server
sudo systemctl status grafana-server.service
sudo /bin/systemctl start grafana-server
```

## 📥 Grafana download

[Download Grafana](https://grafana.com/grafana/download)
