import { useState, useEffect } from 'react';
import { getCustomers, getBookings, getInventory } from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({ customers: 0, bookings: 0, inventory: 0, pending: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customers, bookings, inventory] = await Promise.all([
          getCustomers(),
          getBookings(),
          getInventory()
        ]);
        const pendingBookings = bookings.data.filter(b => b.status === 'pending').length;
        setStats({
          customers: customers.data.length,
          bookings: bookings.data.length,
          inventory: inventory.data.length,
          pending: pendingBookings
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Customers</h3>
          <p className="stat-number">{stats.customers}</p>
        </div>
        <div className="stat-card">
          <h3>Bookings</h3>
          <p className="stat-number">{stats.bookings}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Jobs</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Items</h3>
          <p className="stat-number">{stats.inventory}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
