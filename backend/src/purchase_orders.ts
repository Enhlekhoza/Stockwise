export interface PurchaseOrder {
  id: string;
  supplier: string;
  itemCount: number;
  totalCost: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

let purchaseOrders: PurchaseOrder[] = [
  { id: 'PO-001', supplier: 'Bakers Biscuits', itemCount: 5, totalCost: 'R 550.00', status: 'Pending Approval' },
  { id: 'PO-002', supplier: 'Coca-Cola Beverages', itemCount: 12, totalCost: 'R 1,800.00', status: 'Pending Approval' },
  { id: 'PO-003', supplier: 'Simba Snacks', itemCount: 8, totalCost: 'R 920.00', status: 'Approved' },
  { id: 'PO-004', supplier: 'Dairy Farmers', itemCount: 10, totalCost: 'R 1,200.00', status: 'Pending Approval' },
  { id: 'PO-005', supplier: 'Fresh Produce Co.', itemCount: 20, totalCost: 'R 700.00', status: 'Pending Approval' },
];

export const getPurchaseOrders = () => {
  return purchaseOrders;
};

export const approvePurchaseOrder = (id: string) => {
  const order = purchaseOrders.find(o => o.id === id);
  if (order) {
    order.status = 'Approved';
  }
};

export const rejectPurchaseOrder = (id: string) => {
  const order = purchaseOrders.find(o => o.id === id);
  if (order) {
    order.status = 'Rejected';
  }
};
