import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductManager {
    constructor() {

        this.path = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(data);
            }
            console.log("No se encontró el archivo en:", this.path);
            return [];
        } catch (error) {
            console.error("Error al leer productos:", error);
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            console.log("Faltan campos obligatorios");
            return null;
        }

        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = {
            id: newId,
            status: true,
            thumbnails: product.thumbnails || [],
            ...product
        };

        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(p => p.id === id);
        return product || null;
    }

    async updateProduct(id, updateFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        const { id: _, ...rest } = updateFields; 
        products[index] = { ...products[index], ...rest };
        
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const newProducts = products.filter(p => p.id !== id);

        if (products.length === newProducts.length) return false;

        await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, '\t'));
        return true;
    }
}

export default ProductManager;