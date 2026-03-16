import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, deleteCustomer } from '../api/axios';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', acType: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(form);
      setForm({ name: '', email: '', phone: '', address: '', acType: '' });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h1>Customers</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
        <input type="text" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
        <input type="text" placeholder="AC Type" value={form.acType} onChange={e => setForm({...form, acType: e.target.value})} />
        <button type="submit">Add Customer</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>AC Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.acType}</td>
              <td><button className="btn-delete" onClick={() => handleDelete(c._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
