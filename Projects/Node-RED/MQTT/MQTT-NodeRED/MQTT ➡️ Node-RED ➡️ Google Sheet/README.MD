## 📦 Node-RED Package: `node-red-contrib-google-sheets`

![Node-RED Google Sheets Package](./Photos/Node-RED%20Package.png)

This Node-RED package allows seamless integration with Google Sheets for reading and writing data.

---

## 🔐 Google Cloud Service Account Setup

To enable access to Google Sheets via Node-RED, create a service account in Google Cloud:

👉 [Create Service Account](https://console.cloud.google.com/iam-admin/serviceaccounts?_ga=2.184919274.-272657095.1578084478)

---

## 📄 Google Sheets Basics

### 🔍 Sheet ID

To locate your Sheet ID, check the URL of your Google Sheet.  
Example:

```
https://docs.google.com/spreadsheets/d/1UuVIH2O38XK0TfPMGHk0HG_ixGLtLk6WoBKh4YSrDm4/edit#gid=0
```

✅ The Sheet ID is:  
```
1UuVIH2O38XK0TfPMGHk0HG_ixGLtLk6WoBKh4YSrDm4
```

---

### 📌 Cell Reference Syntax

Google Sheets uses the following format to reference cells:

```
SheetName!StartCell:EndCell
```

#### Examples:
- A block of cells: `Sheet1!A1:C3`
- A column range: `Sheet1!A1:A5`
- A row range: `Sheet1!A1:E1`

📝 Notes:
- `Sheet1` is the name of the tab.
- `!` separates the sheet name from the cell range.
- `:` defines the range from the starting cell to the ending cell.

---
