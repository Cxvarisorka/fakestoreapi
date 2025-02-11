import fs from "fs";
import readFile from "./readFile.js"

const changeFile = async (filePath, data, operation) => {
    try {
        const products = await readFile(filePath);

        if(operation === "add") {
            products.push(data);
        } else if(operation === "delete") {
            const index = products.findIndex(product => product.id === data);
            if(index !== -1) {
                products.splice(index, 1);
            }
        } else if(operation === "update") {
            const index = products.findIndex(product => product.id === data.id);
            if(index !== -1) {
                products[index] = data;
            } else {
                throw new Error("Product not found to update");
            }
        }
        

        fs.writeFile(filePath, JSON.stringify(products), (err) => {
            if (err) {
                throw err;
            } else {
                console.log("File changed successfully!");
            }
        });
    } catch (error) {
        throw new Error(`Failed to append data to ${filePath}: ${error.message}`);
    }
}

export default changeFile;