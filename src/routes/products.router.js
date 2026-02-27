import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const result = await manager.getProducts(limit, page, sort, query);

        if (!result) {
            return res.status(500).send({ status: "error", error: "Error al obtener productos" });
        }

        const buildLink = (pageNumber) => {
            let link = `/api/products?page=${pageNumber}&limit=${limit}`;
            if (sort) link += `&sort=${sort}`;
            if (query) link += `&query=${query}`;
            return link;
        };

        res.send({
            status: "success",
            payload: result.docs, 
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
            nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
        });

    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(req.params.pid);
    if (!product) return res.status(404).send({ error: "Producto no encontrado" });
    res.send(product);
});

router.post('/', async (req, res) => {
    const newProduct = await manager.addProduct(req.body);
    if (!newProduct) return res.status(400).send({ error: "Error al crear producto, revisa los campos" });
    res.status(201).send(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await manager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).send({ error: "Producto no encontrado" });
    res.send(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const result = await manager.deleteProduct(req.params.pid);
    if (!result) return res.status(404).send({ error: "Producto no encontrado" });
    res.send({ status: "success", message: "Producto eliminado" });
});

export default router;