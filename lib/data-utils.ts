import fs from "fs";
import path from "path";

// Define types for our data
export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Path to our data files
const productsFilePath = path.join(process.cwd(), "data", "products.json");
const servicesFilePath = path.join(process.cwd(), "data", "services.json");

// Read products from JSON file
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fs.promises.readFile(productsFilePath, "utf8");

    return JSON.parse(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error reading products:", error);

    return [];
  }
}

// Read a specific product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getProducts();

    return products.find((product) => product.id === id) || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting product by ID:", error);

    return null;
  }
}

// Save products to JSON file
export async function saveProducts(products: Product[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(
      productsFilePath,
      JSON.stringify(products, null, 2),
      "utf8",
    );

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving products:", error);

    return false;
  }
}

// Add a new product
export async function addProduct(
  product: Omit<Product, "id">,
): Promise<Product> {
  try {
    const products = await getProducts();
    const newProduct: Product = {
      ...product,
      id: `product${Date.now()}`, // Generate a unique ID
    };

    await saveProducts([...products, newProduct]);

    return newProduct;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding product:", error);
    throw error;
  }
}

// Update an existing product
export async function updateProduct(
  id: string,
  productData: Partial<Product>,
): Promise<Product | null> {
  try {
    const products = await getProducts();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) return null;

    const updatedProduct = {
      ...products[index],
      ...productData,
      id, // Ensure ID remains the same
    };

    products[index] = updatedProduct;
    await saveProducts(products);

    return updatedProduct;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating product:", error);

    return null;
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const products = await getProducts();
    const filteredProducts = products.filter((product) => product.id !== id);

    if (filteredProducts.length === products.length) {
      // No product was removed
      return false;
    }

    await saveProducts(filteredProducts);

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting product:", error);

    return false;
  }
}

// Read services from JSON file
export async function getServices(): Promise<Service[]> {
  try {
    const data = await fs.promises.readFile(servicesFilePath, "utf8");

    return JSON.parse(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error reading services:", error);

    return [];
  }
}

// Read a specific service by ID
export async function getServiceById(id: string): Promise<Service | null> {
  try {
    const services = await getServices();

    return services.find((service) => service.id === id) || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error getting service by ID:", error);

    return null;
  }
}

// Save services to JSON file
export async function saveServices(services: Service[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(
      servicesFilePath,
      JSON.stringify(services, null, 2),
      "utf8",
    );

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving services:", error);

    return false;
  }
}

// Add a new service
export async function addService(
  service: Omit<Service, "id">,
): Promise<Service> {
  try {
    const services = await getServices();
    const newService: Service = {
      ...service,
      id: `service${Date.now()}`, // Generate a unique ID
    };

    await saveServices([...services, newService]);

    return newService;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error adding service:", error);
    throw error;
  }
}

// Update an existing service
export async function updateService(
  id: string,
  serviceData: Partial<Service>,
): Promise<Service | null> {
  try {
    const services = await getServices();
    const index = services.findIndex((service) => service.id === id);

    if (index === -1) return null;

    const updatedService = {
      ...services[index],
      ...serviceData,
      id, // Ensure ID remains the same
    };

    services[index] = updatedService;
    await saveServices(services);

    return updatedService;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error updating service:", error);

    return null;
  }
}

// Delete a service
export async function deleteService(id: string): Promise<boolean> {
  try {
    const services = await getServices();
    const filteredServices = services.filter((service) => service.id !== id);

    if (filteredServices.length === services.length) {
      // No service was removed
      return false;
    }

    await saveServices(filteredServices);

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error deleting service:", error);

    return false;
  }
}
