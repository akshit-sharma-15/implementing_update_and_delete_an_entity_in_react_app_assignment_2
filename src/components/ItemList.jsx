import { useEffect, useState } from "react";
import Item from "./Item";

const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editText, setEditText] = useState("");

    // Fetch items from API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(API_URI);
                if (!response.ok) throw new Error("Failed to fetch items");
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    // Delete item handler
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URI}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete item");

            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    // Enable edit mode
    const handleEdit = (id, name) => {
        setEditMode(id);
        setEditText(name);
    };

    // Save edited item
    const handleSave = async (id) => {
        console.log(`🔄 Updating item with ID: ${id}`);
    
        try {
            const response = await fetch(`${API_URI}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editText }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update item: ${errorText}`);
            }
    
            const updatedItem = await response.json();
            console.log("✅ Updated item:", updatedItem);
    
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === id ? { ...item, name: updatedItem.name } : item))
            );
            setEditMode(null);
        } catch (error) {
            console.error("❌ Error updating item:", error);
        }
    };
    
    
    

    return (
        <>
            {items.map((item) => (
                <div key={item.id}>
                    {editMode === item.id ? (
                        <>
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                            />
                            <button onClick={() => handleSave(item.id)}>Save</button>
                            <button onClick={() => setEditMode(null)}>Cancel</button>
                        </>
                    ) : (
                        <Item
                            item={item}
                            onDelete={handleDelete}
                            onEdit={() => handleEdit(item.id, item.name)}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default ItemList;
