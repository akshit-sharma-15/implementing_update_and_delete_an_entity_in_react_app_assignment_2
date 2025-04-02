import PropTypes from 'prop-types';

const Item = ({ item, onDelete, onEdit }) => {
    const handleDelete = () => {
        onDelete(item.id);
    };

    const handleEdit = () => {
        onEdit(item.id, item.name);
    };

    return (
        <div style={styles.itemContainer}>
            <p>{item.name}</p>
            <div style={styles.buttonGroup}>
                <button style={styles.editButton} onClick={handleEdit}>Edit</button>
                <button style={styles.deleteButton} onClick={handleDelete}>Delete</button>
            </div>
        </div>
    );
};

// Prop validation
Item.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
};

// Styles
const styles = {
    itemContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9'
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px'
    },
    editButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteButton: {
        backgroundColor: '#F44336',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default Item;
