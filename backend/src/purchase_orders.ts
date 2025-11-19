import db from './db';

export interface PurchaseOrder {
  id: string;
  supplier: string;
  itemCount: number;
  totalCost: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
}

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  return db('purchase_orders').select('*');
};

export const approvePurchaseOrder = async (id: string) => {
  try {
    await db('purchase_orders').where({ id }).update({ status: 'Approved' });
  } catch (error) {
    console.error(`Error approving purchase order ${id}:`, error);
  }
};

export const rejectPurchaseOrder = async (id: string) => {
  try {
    await db('purchase_orders').where({ id }).update({ status: 'Rejected' });
  } catch (error) {
    console.error(`Error rejecting purchase order ${id}:`, error);
  }
};
