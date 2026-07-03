// In-browser stand-in for a products REST API. Seeds from the bundled demo
// catalog and persists edits to localStorage so the admin panel demo keeps
// working across reloads without any server. Swapped out automatically once
// VITE_API_BASE_URL is set — see productsService.js.
import seedData from "../data/db.json";

const STORAGE_KEY = "stride:mock-products";
const LATENCY_MS = 300;

const delay = (ms = LATENCY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

function loadProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore corrupt storage, fall back to seed data
  }
  return structuredClone(seedData.products);
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function nextId(products) {
  const numericIds = products.map((p) => Number(p.id)).filter((n) => !Number.isNaN(n));
  const max = numericIds.length ? Math.max(...numericIds) : 0;
  return String(max + 1);
}

let products = loadProducts();

export const mockProductsAdapter = {
  async list() {
    await delay();
    return structuredClone(products);
  },

  async getById(id) {
    await delay();
    const product = products.find((p) => p.id === String(id));
    if (!product) throw new Error(`Product ${id} not found`);
    return structuredClone(product);
  },

  async create(data) {
    await delay();
    const product = { ...data, id: nextId(products) };
    products = [...products, product];
    saveProducts(products);
    return structuredClone(product);
  },

  async update(id, data) {
    await delay();
    products = products.map((p) => (p.id === String(id) ? { ...p, ...data, id: p.id } : p));
    saveProducts(products);
    return structuredClone(products.find((p) => p.id === String(id)));
  },

  async remove(id) {
    await delay();
    products = products.filter((p) => p.id !== String(id));
    saveProducts(products);
  },

  // Restores the bundled demo catalog, discarding local edits.
  reset() {
    products = structuredClone(seedData.products);
    saveProducts(products);
  },
};
