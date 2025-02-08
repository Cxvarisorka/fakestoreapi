import express from "express";

// Utils
import readFile from "../utils/readFile.js";

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

productsRoutes.get("/category", (req, res) => {
    res.json(["Accessories","Laptops","Displays","Storage","Audio","Cameras","Furniture","Smart Home","Drawing Tablets","Networking","Wearables"
      ]
      );
});



export default productsRoutes;