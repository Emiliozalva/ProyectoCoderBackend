import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    const limit = req.query.limit;
    if (limit) return res.send(products.slice(0, limit));
    res.send(products);
});

router.get('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = await manager.getProductById(pid);
    if (!product) return res.status(404).send({ error: "Producto no encontrado" });
    res.send(product);
});

router.post('/', async (req, res) => {
    console.log("Body recibido:", req.body);
    const newProduct = await manager.addProduct(req.body);
    if (!newProduct || typeof newProduct === 'string') {
        return res.status(400).send({ status: "error", message: newProduct });
    }
    
    res.status(201).send(newProduct);
});

router.put('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = await manager.updateProduct(pid, req.body);
    if (!updatedProduct) return res.status(404).send({ error: "Producto no encontrado" });
    res.send(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const pid = parseInt(req.params.pid);
    const result = await manager.deleteProduct(pid);
    if (!result) return res.status(404).send({ error: "Producto no encontrado" });
    res.send({ status: "success", message: "Producto eliminado" });
});

export default router;