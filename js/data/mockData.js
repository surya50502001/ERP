window.ERP_MOCK_DATA = {
  parties: [
    { id: 'PTY-101', name: 'ABC Traders', type: 'Supplier', phone: '+91 98421 12345', email: 'orders@abctraders.in', location: 'Coimbatore, Tamil Nadu', gstin: '33AAAC1234F1Z1', address: '104 Cross Cut Road, Gandhipuram', country: 'India', state: 'Tamil Nadu', status: 'Active' },
    { id: 'PTY-102', name: 'Kumar & Co', type: 'Supplier', phone: '+91 98432 23456', email: 'sales@kumarco.com', location: 'Tirupur, Tamil Nadu', gstin: '33ABCK5678G2Z2', address: '45 PN Road, Tirupur', country: 'India', state: 'Tamil Nadu', status: 'Active' },
    { id: 'PTY-103', name: 'Sri Lakshmi Suppliers', type: 'Supplier', phone: '+91 97890 34567', email: 'info@srilakshmisuppliers.in', location: 'Salem, Tamil Nadu', gstin: '33ACCL9012H3Z3', address: '12 Main Road, Gugai', country: 'India', state: 'Tamil Nadu', status: 'Active' },
    { id: 'PTY-104', name: 'XYZ Textiles', type: 'Customer', phone: '+91 98250 45678', email: 'purchasing@xyztextiles.com', location: 'Surat, Gujarat', gstin: '24AABX3456J4Z4', address: '702 Ring Road Market', country: 'India', state: 'Gujarat', status: 'Active' },
    { id: 'PTY-105', name: 'Fashion Crafters', type: 'Customer', phone: '+91 98200 56789', email: 'accounts@fashioncrafters.in', location: 'Mumbai, Maharashtra', gstin: '27AAAC9876K5Z5', address: '18 Lower Parel West', country: 'India', state: 'Maharashtra', status: 'Active' },
    { id: 'PTY-106', name: 'Garment Matrix', type: 'Both', phone: '+91 98450 67890', email: 'contact@garmentmatrix.io', location: 'Bengaluru, Karnataka', gstin: '29AABG7890L6Z6', address: '88 Peenya Industrial Area', country: 'India', state: 'Karnataka', status: 'Active' }
  ],

  itemTypes: [
    { id: 'IT-01', name: 'Raw Material', code: 'RM' },
    { id: 'IT-02', name: 'Finished Goods', code: 'FG' },
    { id: 'IT-03', name: 'Semi-Finished Goods', code: 'SFG' },
    { id: 'IT-04', name: 'Packing Material', code: 'PM' },
    { id: 'IT-05', name: 'Trading Goods', code: 'TG' },
    { id: 'IT-06', name: 'Services', code: 'SRV' }
  ],

  brands: [
    { id: 'BR-01', name: 'Generic' },
    { id: 'BR-02', name: 'Prime Quality' },
    { id: 'BR-03', name: 'Eco Line' }
  ],

  categories: {
    major: [
      { id: 'MJ-01', name: 'Yarn', code: 'YRN' },
      { id: 'MJ-02', name: 'Fabric', code: 'FBC' },
      { id: 'MJ-03', name: 'Trims & Accessories', code: 'TRM' }
    ],
    sub: [
      { id: 'SB-01', majorId: 'MJ-01', name: 'Cotton Yarn' },
      { id: 'SB-02', majorId: 'MJ-01', name: 'Synthetic Yarn' },
      { id: 'SB-03', majorId: 'MJ-02', name: 'Knitted Fabric' },
      { id: 'SB-04', majorId: 'MJ-02', name: 'Woven Fabric' }
    ],
    subSub: [
      { id: 'SSB-01', subId: 'SB-01', name: 'Combed Cotton' },
      { id: 'SSB-02', subId: 'SB-01', name: 'Carded Cotton' },
      { id: 'SSB-03', subId: 'SB-02', name: 'Polyester Filament' },
      { id: 'SSB-04', subId: 'SB-03', name: 'Single Jersey' }
    ]
  },

  uoms: [
    { id: 'UOM-01', code: 'KG', name: 'Kilograms', decimalPlaces: 2 },
    { id: 'UOM-02', code: 'MTR', name: 'Meters', decimalPlaces: 2 },
    { id: 'UOM-03', code: 'PCS', name: 'Pieces', decimalPlaces: 0 },
    { id: 'UOM-04', code: 'RLL', name: 'Rolls', decimalPlaces: 0 },
    { id: 'UOM-05', code: 'BOX', name: 'Boxes', decimalPlaces: 0 }
  ],

  locations: [
    {
      country: 'India',
      code: 'IN',
      states: ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Karnataka', 'Punjab', 'West Bengal', 'Rajasthan']
    },
    {
      country: 'United Arab Emirates',
      code: 'AE',
      states: ['Dubai', 'Abu Dhabi', 'Sharjah']
    },
    {
      country: 'United States',
      code: 'US',
      states: ['California', 'Texas', 'New York', 'North Carolina']
    }
  ],

  products: [
    {
      id: 'PRD-001',
      name: 'Cotton Yarn 40s Combed',
      uom: 'KG',
      majorGroup: 'Yarn',
      subGroup: 'Cotton Yarn',
      subSubGroup: 'Combed Cotton',
      availableStock: 180,
      minReorderLevel: 50,
      avgRate: 210,
      stockValue: 37800,
      hsnCode: '52051210',
      gstRate: 5,
      status: 'Active',
      description: 'Premium quality 40s combed cotton yarn suitable for fine knitting.'
    },
    {
      id: 'PRD-002',
      name: 'Polyester Yarn 150D/48F',
      uom: 'KG',
      majorGroup: 'Yarn',
      subGroup: 'Synthetic Yarn',
      subSubGroup: 'Polyester Filament',
      availableStock: 125,
      minReorderLevel: 30,
      avgRate: 160,
      stockValue: 20000,
      hsnCode: '54023300',
      gstRate: 12,
      status: 'Active',
      description: 'Textured polyester yarn for weaving and warp knitting.'
    },
    {
      id: 'PRD-003',
      name: 'Viscose Rayon Yarn 30s',
      uom: 'KG',
      majorGroup: 'Yarn',
      subGroup: 'Synthetic Yarn',
      subSubGroup: 'Polyester Filament',
      availableStock: 90,
      minReorderLevel: 40,
      avgRate: 195,
      stockValue: 17550,
      hsnCode: '55101110',
      gstRate: 12,
      status: 'Active',
      description: 'High luster viscose rayon spun yarn for soft draping fabrics.'
    },
    {
      id: 'PRD-004',
      name: 'Single Jersey Fabric 180 GSM',
      uom: 'MTR',
      majorGroup: 'Fabric',
      subGroup: 'Knitted Fabric',
      subSubGroup: 'Single Jersey',
      availableStock: 450,
      minReorderLevel: 100,
      avgRate: 340,
      stockValue: 153000,
      hsnCode: '60062200',
      gstRate: 5,
      status: 'Active',
      description: '100% bio-washed cotton single jersey circular knit fabric.'
    },
    {
      id: 'PRD-005',
      name: 'Organic Cotton Yarn 30s',
      uom: 'KG',
      majorGroup: 'Yarn',
      subGroup: 'Cotton Yarn',
      subSubGroup: 'Combed Cotton',
      availableStock: 15,
      minReorderLevel: 50,
      avgRate: 240,
      stockValue: 3600,
      hsnCode: '52051220',
      gstRate: 5,
      status: 'Low Stock',
      description: 'GOTS certified 100% organic cotton yarn.'
    }
  ],

  batches: {
    'PRD-001': [
      { batchNo: 'B001', receivedDate: '2026-08-10', initialQty: 100, availableQty: 100, rate: 200, grnId: 'GRN-1090' },
      { batchNo: 'B005', receivedDate: '2026-08-18', initialQty: 80, availableQty: 80, rate: 222.5, grnId: 'GRN-1092' }
    ],
    'PRD-002': [
      { batchNo: 'B002', receivedDate: '2026-08-12', initialQty: 125, availableQty: 125, rate: 160, grnId: 'GRN-1085' }
    ],
    'PRD-003': [
      { batchNo: 'B003', receivedDate: '2026-08-14', initialQty: 90, availableQty: 90, rate: 195, grnId: 'GRN-1087' }
    ],
    'PRD-004': [
      { batchNo: 'B004', receivedDate: '2026-08-15', initialQty: 450, availableQty: 450, rate: 340, grnId: 'GRN-1089' }
    ],
    'PRD-005': [
      { batchNo: 'B006', receivedDate: '2026-08-05', initialQty: 15, availableQty: 15, rate: 240, grnId: 'GRN-1078' }
    ]
  },

  purchaseOrders: [
    {
      id: 'PO-1042',
      supplierId: 'PTY-101',
      supplierName: 'ABC Traders',
      date: '2026-08-20',
      expectedDate: '2026-08-25',
      status: 'Received',
      itemsCount: 2,
      totalAmount: 42500,
      grnId: 'GRN-1092',
      grnDate: '2026-08-20',
      notes: 'Standard delivery via VRL Logistics.',
      items: [
        { productId: 'PRD-001', productName: 'Cotton Yarn 40s Combed', qty: 100, uom: 'KG', rate: 210, amount: 21000 },
        { productId: 'PRD-002', productName: 'Polyester Yarn 150D/48F', qty: 134.37, uom: 'KG', rate: 160, amount: 21500 }
      ],
      activity: [
        { date: '2026-08-20 09:30', user: 'Admin', title: 'PO Created', detail: 'Purchase order PO-1042 issued to ABC Traders.' },
        { date: '2026-08-20 14:15', user: 'Store Manager', title: 'Goods Received (GRN-1092)', detail: 'All items received in good condition into Warehouse A.' }
      ]
    },
    {
      id: 'PO-1043',
      supplierId: 'PTY-102',
      supplierName: 'Kumar & Co',
      date: '2026-08-19',
      expectedDate: '2026-08-24',
      status: 'Pending',
      itemsCount: 2,
      totalAmount: 85500,
      grnId: null,
      notes: 'Urgent order for upcoming knitting batch.',
      items: [
        { productId: 'PRD-003', productName: 'Viscose Rayon Yarn 30s', qty: 100, uom: 'KG', rate: 195, amount: 19500 },
        { productId: 'PRD-004', productName: 'Single Jersey Fabric 180 GSM', qty: 200, uom: 'MTR', rate: 330, amount: 66000 }
      ],
      activity: [
        { date: '2026-08-19 11:00', user: 'Admin', title: 'PO Created', detail: 'Purchase order issued.' }
      ]
    },
    {
      id: 'PO-1044',
      supplierId: 'PTY-103',
      supplierName: 'Sri Lakshmi Suppliers',
      date: '2026-08-18',
      expectedDate: '2026-08-22',
      status: 'Partial',
      itemsCount: 1,
      totalAmount: 23500,
      grnId: 'GRN-1088',
      grnDate: '2026-08-19',
      notes: 'Partial shipment received due to transport delay.',
      items: [
        { productId: 'PRD-005', productName: 'Organic Cotton Yarn 30s', qty: 100, uom: 'KG', rate: 235, amount: 23500, receivedQty: 50 }
      ],
      activity: [
        { date: '2026-08-18 16:45', user: 'Admin', title: 'PO Created', detail: 'Purchase order created.' },
        { date: '2026-08-19 10:20', user: 'Store Manager', title: 'Partial GRN Received (GRN-1088)', detail: 'Received 50 KG of 100 KG.' }
      ]
    },
    {
      id: 'PO-1045',
      supplierId: 'PTY-106',
      supplierName: 'Garment Matrix',
      date: '2026-08-15',
      expectedDate: '2026-08-18',
      status: 'Cancelled',
      itemsCount: 1,
      totalAmount: 10250,
      grnId: null,
      notes: 'Order cancelled due to spec mismatch.',
      items: [
        { productId: 'PRD-001', productName: 'Cotton Yarn 40s Combed', qty: 50, uom: 'KG', rate: 205, amount: 10250 }
      ],
      activity: [
        { date: '2026-08-15 10:00', user: 'Admin', title: 'PO Created', detail: 'Purchase order created.' },
        { date: '2026-08-16 09:00', user: 'Admin', title: 'PO Cancelled', detail: 'Cancelled per buyer request.' }
      ]
    }
  ],

  salesInvoices: [
    {
      id: 'INV-2081',
      customerId: 'PTY-104',
      customerName: 'XYZ Textiles',
      date: '2026-08-20',
      dueDate: '2026-09-04',
      status: 'Paid',
      itemsCount: 2,
      subtotal: 49500,
      tax: 2475,
      totalAmount: 51975,
      items: [
        { productId: 'PRD-001', productName: 'Cotton Yarn 40s Combed', qty: 50, uom: 'KG', rate: 230, amount: 11500 },
        { productId: 'PRD-004', productName: 'Single Jersey Fabric 180 GSM', qty: 100, uom: 'MTR', rate: 380, amount: 38000 }
      ]
    },
    {
      id: 'INV-2082',
      customerId: 'PTY-105',
      customerName: 'Fashion Crafters',
      date: '2026-08-19',
      dueDate: '2026-09-03',
      status: 'Pending',
      itemsCount: 1,
      subtotal: 7200,
      tax: 864,
      totalAmount: 8064,
      items: [
        { productId: 'PRD-002', productName: 'Polyester Yarn 150D/48F', qty: 40, uom: 'KG', rate: 180, amount: 7200 }
      ]
    },
    {
      id: 'INV-2083',
      customerId: 'PTY-106',
      customerName: 'Garment Matrix',
      date: '2026-08-10',
      dueDate: '2026-08-17',
      status: 'Overdue',
      itemsCount: 1,
      subtotal: 6600,
      tax: 792,
      totalAmount: 7392,
      items: [
        { productId: 'PRD-003', productName: 'Viscose Rayon Yarn 30s', qty: 30, uom: 'KG', rate: 220, amount: 6600 }
      ]
    }
  ],

  recentActivities: [
    { id: 'ACT-01', code: 'PO-1042', party: 'ABC Traders', detail: '₹42,500 • Goods Received', time: '10 mins ago', type: 'purchases', status: 'Received' },
    { id: 'ACT-02', code: 'GRN-1092', party: 'Kumar & Co', detail: '120 KG Received into Batch B005', time: '45 mins ago', type: 'grn', status: 'Success' },
    { id: 'ACT-03', code: 'INV-2081', party: 'XYZ Textiles', detail: '₹51,975 • Invoice Paid', time: '2 hours ago', type: 'sales', status: 'Paid' },
    { id: 'ACT-04', code: 'PO-1043', party: 'Kumar & Co', detail: '₹85,500 • Awaiting GRN', time: '5 hours ago', type: 'purchases', status: 'Pending' }
  ],

  notifications: [
    { id: 'N1', title: 'GRN Received', message: 'PO-1042 items received into inventory.', time: '10m ago', unread: true },
    { id: 'N2', title: 'Low Stock Alert', message: 'Organic Cotton Yarn 30s has reached 15 KG (Below 50 KG threshold).', time: '1h ago', unread: true },
    { id: 'N3', title: 'Invoice Overdue', message: 'INV-2083 for Garment Matrix (₹7,392) is overdue by 3 days.', time: '1d ago', unread: false }
  ]
};
