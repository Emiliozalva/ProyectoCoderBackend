import { productModel } from '../models/product.model.js';

class ProductManager {
    // 1. OBTENER PRODUCTOS CON FILTROS Y PAGINACIÓN
    async getProducts(limit = 10, page = 1, sort, query) {
        try {
            let filter = {};
            if (query) {
                if (query === 'true' || query === 'false') {
                    filter.status = query === 'true';
                } else {
                    filter.category = query;
                }
            }

            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                lean: true
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 }; 
            }

            return await productModel.paginate(filter, options);
        } catch (error) {
            console.error("Error en getProducts:", error);
            return null;
        }
    }

    // 2. BUSCAR POR ID
    async getProductById(id) {
        try {
            return await productModel.findById(id).lean();
        } catch (error) {
            return null;
        }
    }

    // 3. AGREGAR PRODUCTO
    async addProduct(product) {
        try {
            return await productModel.create(product);
        } catch (error) {
            console.error("Error al crear producto:", error.message);
            return null;
        }
    }

    // 4. ACTUALIZAR PRODUCTO
    async updateProduct(id, updateFields) {
        try {
            return await productModel.findByIdAndUpdate(id, updateFields, { new: true }).lean();
        } catch (error) {
            return null;
        }
    }

    // 5. BORRAR PRODUCTO
    async deleteProduct(id) {
        try {
            const deleted = await productModel.findByIdAndDelete(id);
            return deleted ? true : false;
        } catch (error) {
            return false;
        }
    }
}

export default ProductManager;