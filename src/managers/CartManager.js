import { cartModel } from '../models/cart.model.js';

class CartManager {
    async createCart() {
        try {
            return await cartModel.create({ products: [] });
        } catch (error) {
            console.error("Error al crear carrito:", error);
            return null;
        }
    }

    async getCartById(id) {
        try {
            return await cartModel.findById(id).populate('products.product').lean();
        } catch (error) {
            console.error("Error al obtener carrito:", error);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            return null;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            return null;
        }
    }

    async updateCart(cartId, productsArray) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: productsArray }, { new: true });
        } catch (error) {
            return null;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    async clearCart(cartId) {
        try {
            return await cartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        } catch (error) {
            return null;
        }
    }
}

export default CartManager;