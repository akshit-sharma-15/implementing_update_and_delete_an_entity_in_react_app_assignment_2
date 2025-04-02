const path = require("node:path");
const fs = require("node:fs");
const express = require("express");
const cors = require("cors");

const PORT = process.env.SECONDARY_PUBLIC_PORT || 8000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Utility Functions to Load and Save Data
const loadData = (key) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        const dataBuffer = fs.readFileSync(dbPath);
        const dataJSON = dataBuffer.toString();
        const data = JSON.parse(dataJSON);
        return key ? data[key] : data;
    } catch (e) {
        return {};
    }
};

const saveData = (key, data) => {
    try {
        const dbPath = path.resolve(__dirname, "db.json");
        const existingData = loadData();
        const newData = { ...existingData, [key]: data };
        const dataJSON = JSON.stringify(newData, null, 2);
        fs.writeFileSync(dbPath, dataJSON);
        return data;
    } catch (e) {
        return {};
    }
};

// ✅ GET All Doors
app.get("/doors", (_, res) => {
    const doorsData = loadData("doors") || [];
    res.json(doorsData);
});

// ✅ GET Single Door by ID
app.get("/doors/:id", (req, res) => {
    const doorsData = loadData("doors") || [];
    const door = doorsData.find((door) => door.id === req.params.id);
    if (door) {
        return res.json(door);
    }
    res.status(404).json({ message: "Door not found" });
});

// ✅ POST (Create New Door)
app.post("/doors", (req, res) => {
    const doorsData = loadData("doors") || [];
    const newDoor = { id: (doorsData.length + 1).toString(), ...req.body };
    doorsData.push(newDoor);
    saveData("doors", doorsData);
    res.status(201).json(newDoor);
});

// ✅ PUT (Replace Entire Door Object)
app.put("/doors/:id", (req, res) => {
    const doorsData = loadData("doors") || [];
    const doorIndex = doorsData.findIndex((door) => door.id === req.params.id);

    if (doorIndex !== -1) {
        delete req.body.id; // Prevent updating the ID
        doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };
        saveData("doors", doorsData);
        return res.status(200).json(doorsData[doorIndex]);
    }

    res.status(404).json({ message: "Door not found" });
});

// ✅ DELETE (Remove Door by ID)
app.delete("/doors/:id", (req, res) => {
    const doorsData = loadData("doors") || [];
    const doorIndex = doorsData.findIndex((door) => door.id === req.params.id);

    if (doorIndex !== -1) {
        const deletedDoor = doorsData.splice(doorIndex, 1);
        saveData("doors", doorsData);
        return res.status(200).json(deletedDoor);
    }

    res.status(404).json({ message: "Door not found" });
});

// ✅ PATCH (Update Specific Fields of a Door)
app.patch("/doors/:id", (req, res) => {
    const doorsData = loadData("doors") || [];
    const doorIndex = doorsData.findIndex((door) => door.id === req.params.id);

    if (doorIndex === -1) {
        return res.status(404).json({ message: "Door not found" });
    }

    // Merge existing door data with provided updates
    doorsData[doorIndex] = { ...doorsData[doorIndex], ...req.body };

    saveData("doors", doorsData);
    res.json(doorsData[doorIndex]);
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
