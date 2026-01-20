import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await manager.createCart();
    res.status(201).send(newCart);
});

router.get('/:cid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const cart = await manager.getCartById(cid);
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.send(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const cart = await manager.addProductToCart(cid, pid);
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.send(cart);
});

export default router;