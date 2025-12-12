"use client"
import { useEffect, useState } from "react"
import ProductForm from "../../ProductForm";
export default function CreatePage() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch("http://localhost:3001/categories");
            const data = await res.json();
            setCategories(data);
        }
        fetchCategories();
    })
const handleSubmit = async (data: any) => {
    await fetch("http://localhost:3001/products", {
        method: "POST",
        body: JSON.stringify(data),
    })
}

    return (
        <div>
            <h1>Create Product</h1>
            <ProductForm categories={categories} onSubmit={handleSubmit} />
        </div>
    )
}
