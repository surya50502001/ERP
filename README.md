# Prime ERP - Premium Business ERP Frontend

A complete, production-quality React ERP application backed by an ASP.NET Core 8 Web API and PostgreSQL database, designed with a modern SaaS aesthetic.

## 📐 Engineering Standard & Architecture Guidelines

All development on this project follows the official **[ERP Golden Path & Architecture Guidelines](docs/ERP-GOLDEN-PATH.md)**.
Developers implementing new Masters, Transactions, APIs, or UI screens must follow the established Golden Path patterns documented in [`docs/ERP-GOLDEN-PATH.md`](docs/ERP-GOLDEN-PATH.md).

## 🚀 Features

- **Dashboard**: Operational metrics, "Needs Attention" actionable alerts, and real-time activity audit stream.
- **Purchases & PO Workspace**: PO list table, workspace (`Overview`, `Items`, `Receiving`, `Activity`), inline `+ Create product` modal, and `[Receive Goods]` GRN drawer.
- **Stock & Automated FIFO Inventory**: Stock levels table and interactive FIFO batch ledger drawer (batch numbers, arrival dates, available quantities, purchase rates).
- **Sales & Fast Invoicing Workspace**: Invoice creation with inline `+ Create customer` drawer, stock availability indicators, GST calculation, and automated FIFO stock reduction upon dispatch.
- **Master Data Hub**: Unified Parties (Customers, Suppliers, Both), Products (with progressive disclosure "More details"), Categories hierarchy, UOMs, and Locations (Countries & States).
- **Command Palette (`Ctrl + K`)**: Keyboard-navigable global search across all ERP entities.
- **LocalStorage Data Flow**: Automatic persistence of transactions, stock movements, and master data in `window.localStorage`.

## 📦 Tech Stack

- **React 18 & ReactDOM 18**
- **Tailwind CSS**
- **Lucide Icons**
- **LocalStorage State Sync**

## 🛠️ How to Run

### Method 1: Double-Click Launcher
Double-click `run.bat` to launch the server on `http://localhost:3000` (and accessible over Wi-Fi network at `http://<your-ip>:3000`).

### Method 2: Command Line
```cmd
python -m http.server 3000 --bind 0.0.0.0
```

### Method 3: Direct Browser Launch
Open `index.html` directly in any web browser.
