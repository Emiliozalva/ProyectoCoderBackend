import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).send({ status: "success", payload: newCart });
});

router.get('/:cid', async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
    res.send({ status: "success", payload: cart });
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await manager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
    res.send({ status: "success", payload: updatedCart });
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const updatedCart = await manager.deleteProductFromCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
    res.send({ status: "success", payload: updatedCart, message: "Producto eliminado del carrito" });
});

router.put('/:cid', async (req, res) => {
    const updatedCart = await manager.updateCart(req.params.cid, req.body.products);
    if (!updatedCart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
    res.send({ status: "success", payload: updatedCart });
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { quantity } = req.body;
    const updatedCart = await manager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updatedCart) return res.status(404).send({ status: "error", error: "Carrito o producto no encontrado" });
    res.send({ status: "success", payload: updatedCart });
});

router.delete('/:cid', async (req, res) => {
    const updatedCart = await manager.clearCart(req.params.cid);
    if (!updatedCart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
    res.send({ status: "success", payload: updatedCart, message: "Carrito vaciado" });
});

export default router;