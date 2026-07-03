// Single entry point the app uses to read/write products. Routes to a real
// backend when VITE_API_BASE_URL is configured, otherwise to the in-browser
// mock adapter. Stores/components should depend on this, never on fetch()
// or the adapters directly.
import { apiRequest, isBackendConfigured } from "./httpClient";
import { mockProductsAdapter } from "./mockProductsAdapter";

export async function listProducts() {
  return isBackendConfigured ? apiRequest("/products") : mockProductsAdapter.list();
}

export async function getProduct(id) {
  return isBackendConfigured ? apiRequest(`/products/${id}`) : mockProductsAdapter.getById(id);
}

export async function createProduct(data) {
  return isBackendConfigured
    ? apiRequest("/products", { method: "POST", body: JSON.stringify(data) })
    : mockProductsAdapter.create(data);
}

export async function updateProduct(id, data) {
  return isBackendConfigured
    ? apiRequest(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) })
    : mockProductsAdapter.update(id, data);
}

export async function deleteProduct(id) {
  return isBackendConfigured
    ? apiRequest(`/products/${id}`, { method: "DELETE" })
    : mockProductsAdapter.remove(id);
}
