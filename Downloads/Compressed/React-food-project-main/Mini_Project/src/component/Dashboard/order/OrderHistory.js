import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './order.css';
import { useHistory } from 'react-router-dom';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const history = useHistory();

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (!user) {
        setError('Please login to view orders');
        setLoading(false);
        history.push('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/orders?email=${user.email}`);
      console.log('Orders response:', response.data);
      
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Session expired. Please login again.');
        history.push('/login');
      } else {
        setError('Failed to fetch orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Received':
        return '#FFA500'; // Orange
      case 'Preparing':
        return '#4169E1'; // Blue
      case 'Ready':
        return '#32CD32'; // Green
      case 'Completed':
        return '#808080'; // Gray
      default:
        return '#000000'; // Black
    }
  };

  if (loading) {
    return (
      <div className="order-body">
        <div className="order-main">
          <h1>Order History</h1>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-body">
        <div className="order-main">
          <h1>Order History</h1>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-body">
      <div className="order-main">
        <h1>Order History</h1>
        
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <span 
                    style={{ 
                      color: getStatusColor(order.status),
                      fontWeight: 'bold',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      backgroundColor: `${getStatusColor(order.status)}20`
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-detail">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                  </div>
                  <div className="order-timestamp">
                    Ordered on: {new Date(order.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory; 