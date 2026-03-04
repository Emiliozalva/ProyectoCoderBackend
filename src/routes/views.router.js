import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/products', async (req, res) => {
    const { page = 1, limit = 5 } = req.query; 
    const result = await productManager.getProducts(limit, page);
    
    res.render('products', { 
        title: "Catálogo de Productos",
        products: result.docs,
        pagination: result 
    });
});

router.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    
    res.render('productDetail', { title: product.title, product });
});

router.get('/carts/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send("Carrito no encontrado");
    
    res.render('cart', { title: "Mi Carrito", cart });
});

export default router;