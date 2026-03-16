import { useState, useEffect } from 'react';
import { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } from '../api/axios';

function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', category: '', partNumber: '', quantity: '', price: '', minStock: '', description: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await getInventory();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventoryItem({ ...form, quantity: Number(form.quantity), price: Number(form.price), minStock: Number(form.minStock) });
      setForm({ name: '', category: '', partNumber: '', quantity: '', price: '', minStock: '', description: '' });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    try {
      const item = items.find(i => i._id === id);
      await updateInventoryItem(id, { ...item, quantity: qty });
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventoryItem(id);
      fetchInventory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h1>Parts Inventory</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Part Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
          <option value="">Select Category</option>
          <option value="Compressor">Compressor</option>
          <option value="Capacitor">Capacitor</option>
          <option value="Fan Motor">Fan Motor</option>
          <option value="Thermostat">Thermostat</option>
          <option value="Refrigerant">Refrigerant</option>
          <option value="Filter">Filter</option>
          <option value="Other">Other</option>
        </select>
        <input type="text" placeholder="Part Number" value={form.partNumber} onChange={e => setForm({...form, partNumber: e.target.value})} />
        <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
        <input type="number" placeholder="Price (₹)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <input type="number" placeholder="Min Stock" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} />
        <input type="text" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit">Add Part</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Part Name</th>
            <th>Category</th>
            <th>Part #</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id} className={i.quantity < i.minStock ? 'low-stock' : ''}>
              <td>{i.name}</td>
              <td>{i.category}</td>
              <td>{i.partNumber}</td>
              <td>
                <input type="number" value={i.quantity} onChange={(e) => handleQuantityChange(i._id, Number(e.target.value))} style={{width: '60px'}} />
              </td>
              <td>₹{i.price}</td>
              <td><button className="btn-delete" onClick={() => handleDelete(i._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
