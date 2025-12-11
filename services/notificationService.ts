
import { Order } from '../types';

// Service disabled by user request. 
// Function signature kept to prevent import errors in previous versions if cached, but effectively does nothing.
export const sendOrderConfirmation = async (order: Order): Promise<boolean> => {
  return true; 
};
