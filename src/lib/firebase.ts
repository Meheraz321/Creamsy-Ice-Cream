import { initializeApp } from "firebase/app";
import { initializeFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, getDocFromServer, where, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0292580073",
  appId: "1:870390842710:web:6ad5f250bd67f9e8dfc2f7",
  apiKey: "AIzaSyAdZNiXy3weqQJBl0CoQKNzpXhZ96J2vsI",
  authDomain: "gen-lang-client-0292580073.firebaseapp.com",
  storageBucket: "gen-lang-client-0292580073.firebasestorage.app",
  messagingSenderId: "870390842710"
};

const databaseId = "ai-studio-creamsyicecream-a70dfe9a-94c2-47ab-8d03-8d23961e7551";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the custom database ID
export const db = initializeFirestore(app, {}, databaseId);

// Test connection on boot to satisfy the integration guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export interface OrderItem {
  flavorId: string;
  name: string;
  price: string;
  quantity: number;
}

export interface FirebaseOrder {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  paymentMethod: string;
  transactionId: string;
  amountUsd: number;
  amountBdt: number;
  status: "Pending" | "Shipped" | "Cancelled";
  createdAt: string;
}

// Save an order
export async function saveOrder(order: Omit<FirebaseOrder, "id">) {
  try {
    const ordersCol = collection(db, "orders");
    const docRef = await addDoc(ordersCol, order);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}

// Fetch all orders
export async function getOrders(): Promise<FirebaseOrder[]> {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const orders: FirebaseOrder[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as FirebaseOrder);
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: "Pending" | "Shipped" | "Cancelled") {
  try {
    const orderDoc = doc(db, "orders", orderId);
    await updateDoc(orderDoc, { status });
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

// Fetch orders by customer phone number
export async function getCustomerOrders(phone: string): Promise<FirebaseOrder[]> {
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, where("customerPhone", "==", phone));
    const querySnapshot = await getDocs(q);
    const orders: FirebaseOrder[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as FirebaseOrder);
    });
    // Sort by createdAt descending
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching customer orders by phone:", error);
    // Fallback: Fetch all and filter client-side to guarantee it never crashes the user's interface
    try {
      const allOrders = await getOrders();
      return allOrders.filter(order => order.customerPhone === phone);
    } catch (fallbackError) {
      console.error("Fallback order query failed:", fallbackError);
      throw error;
    }
  }
}

export interface FirebaseCustomer {
  id?: string;
  name: string;
  phone: string;
  pin: string;
  createdAt: string;
}

// Register a new customer in Firestore
export async function registerCustomer(name: string, phone: string, pin: string): Promise<FirebaseCustomer> {
  try {
    const customerDocRef = doc(db, "customers", phone);
    const customerSnapshot = await getDoc(customerDocRef);
    if (customerSnapshot.exists()) {
      throw new Error("This phone number is already registered. Please log in.");
    }
    const newCustomer: FirebaseCustomer = {
      name,
      phone,
      pin, // Numerical PIN code for simple auth
      createdAt: new Date().toISOString()
    };
    await setDoc(customerDocRef, newCustomer);
    return newCustomer;
  } catch (error) {
    console.error("Error registering customer:", error);
    throw error;
  }
}

// Log in a customer and verify PIN from Firestore
export async function loginCustomer(phone: string, pin: string): Promise<FirebaseCustomer> {
  try {
    const customerDocRef = doc(db, "customers", phone);
    const customerSnapshot = await getDoc(customerDocRef);
    if (!customerSnapshot.exists()) {
      throw new Error("Account not found. Please register or check your phone number.");
    }
    const data = customerSnapshot.data() as FirebaseCustomer;
    if (data.pin !== pin) {
      throw new Error("Incorrect PIN code. Please try again.");
    }
    return data;
  } catch (error) {
    console.error("Error logging in customer:", error);
    throw error;
  }
}
