import { useEffect, useState } from 'react';
import ItemList from './components/ItemList';

// API URI for fetching door items
const API_URI = `http://${import.meta.env.VITE_API_URI}/doors`;

function App() {
    const [items, setItems] = useState([]);

    // Fetch items from the server
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(API_URI);
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    // Delete item handler
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URI}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }
            setItems((prevItems) => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Edit item handler (for demonstration purposes)
    const handleEdit = async (id, updatedName) => {
        try {
            const response = await fetch(`${API_URI}/${id}`, {
                method: 'PATCH', // or 'PUT' if your backend requires it
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: updatedName }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
    
            const updatedItem = await response.json();
    
            // Update the state with the edited item
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === id ? updatedItem : item))
            );
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };
    
    
    

    return <ItemList items={items} onDelete={handleDelete} onEdit={handleEdit} />;
}

export default App;
