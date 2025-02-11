import express from "express";

// Utils
import readFile from "../utils/readFile.js";
import changeFile from "../utils/changeFile.js";

const productsRoutes = express.Router();

const productsPath = "products.json";

productsRoutes.get("/", async (req, res) => {
    
    const { limit, sort } = req.query;

    try {
        let products = await readFile(productsPath);

        if(limit) {
            products = products.slice(0, parseInt(limit));
        }

        if(sort) {
            products.sort((a, b) => {
                if(sort === "asc") {
                    return a.price - b.price;
                } else if(sort === "desc") {
                    return b.price - a.price;
                }
            });
        }

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ error: "Failed to read products.json" });
    }
})

productsRoutes.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const products = await readFile(productsPath);
        const product = products.find((product) => product.id === parseInt(id));

        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to read products.json" });
    }
})

productsRoutes.get("/category/:category", async (req, res) => {
    
    const { category } = req.params;

    try {
        const products = await readFile(productsPath);
        const filteredProducts = products.filter((product) => product.category === category);

        console.log("Filtered products: ", filteredProducts);

        if(filteredProducts.length === 0) {
            return res.status(404).json({ error: "No products found in this category" });
        }

        return res.status(200).json(filteredProducts);
    } catch (error) {
        return res.status(500).json({ error: "Failed to read products.json" });
    }
})

productsRoutes.post("/", async (req, res) => {
    const { name, category, price, stock } = req.body;

    if (!(name && category && price && stock)) {
        return res.status(400).json({ error: 'Not enough information' });
    }

    try {
        const product = { id: Date.now(), name, category, price, stock };
        await changeFile(productsPath, product, "add");

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productsRoutes.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const response = await changeFile(productsPath, parseInt(id), "delete");

        res.json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

productsRoutes.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    if (!(name || category || price || stock)) {
        return res.status(400).json({ error: 'Not enough information' });
    }

    const updateObject = {};

    if (name) updateObject.name = name;
    if (category) updateObject.category = category;
    if (price) updateObject.price = price;
    if (stock) updateObject.stock = stock;

    updateObject.id = parseInt(id);


    try {
        await changeFile(productsPath, updateObject, "update");

        res.json(updateObject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
});



export default productsRoutes;