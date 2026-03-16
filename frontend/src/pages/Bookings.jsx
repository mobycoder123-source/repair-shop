import { useState, useEffect } from 'react';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../api/axios';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', serviceType: '', acType: '', issue: '', appointmentDate: '', price: '', notes: '' });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking({ ...form, price: Number(form.price) });
      setForm({ customerName: '', customerPhone: '', serviceType: '', acType: '', issue: '', appointmentDate: '', price: '', notes: '' });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateBooking(id, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h1>Service Bookings</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Customer Name" value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} required />
        <input type="text" placeholder="Phone" value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} required />
        <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} required>
          <option value="">Select Service</option>
          <option value="Installation">Installation</option>
          <option value="Repair">Repair</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Gas Refill">Gas Refill</option>
        </select>
        <input type="text" placeholder="AC Type" value={form.acType} onChange={e => setForm({...form, acType: e.target.value})} />
        <input type="text" placeholder="Issue" value={form.issue} onChange={e => setForm({...form, issue: e.target.value})} />
        <input type="date" value={form.appointmentDate} onChange={e => setForm({...form, appointmentDate: e.target.value})} />
        <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
        <input type="text" placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        <button type="submit">Create Booking</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>AC Type</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b._id}>
              <td>{b.customerName}<br/><small>{b.customerPhone}</small></td>
              <td>{b.serviceType}</td>
              <td>{b.acType}</td>
              <td>{b.appointmentDate ? new Date(b.appointmentDate).toLocaleDateString() : '-'}</td>
              <td>₹{b.price}</td>
              <td>
                <select value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)} className={`status-${b.status}`}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td><button className="btn-delete" onClick={() => handleDelete(b._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Bookings;
