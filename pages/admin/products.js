// pages/admin/products.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function AdminProducts() {
  const { loading: authLoading } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    minInvestment: '',
    maxInvestment: '',
    returnPercentage: '',
    duration: '',
    status: 'Active'
  });

  useEffect(() => {
    if (authLoading) return;
    
    const loadProducts = async () => {
      try {
        // Mock data
        const mockProducts = [
          { id: 1, name: 'Bronze Package', minInvestment: 1000000, maxInvestment: 5000000, returnPercentage: 5, duration: 30, status: 'Active' },
          { id: 2, name: 'Silver Package', minInvestment: 5000000, maxInvestment: 20000000, returnPercentage: 7, duration: 60, status: 'Active' },
          { id: 3, name: 'Gold Package', minInvestment: 20000000, maxInvestment: 100000000, returnPercentage: 10, duration: 90, status: 'Inactive' },
        ];
        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [authLoading]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      minInvestment: product.minInvestment,
      maxInvestment: product.maxInvestment,
      returnPercentage: product.returnPercentage,
      duration: product.duration,
      status: product.status
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would call an API
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...formData } 
          : p
      ));
    }
    setEditingProduct(null);
    setFormData({
      name: '',
      minInvestment: '',
      maxInvestment: '',
      returnPercentage: '',
      duration: '',
      status: 'Active'
    });
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      minInvestment: '',
      maxInvestment: '',
      returnPercentage: '',
      duration: '',
      status: 'Active'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Product Management">
      <Head>
        <title>Stoneform Capital | Product Management</title>
      </Head>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">Investment Products</h2>
        </div>

        {/* Edit Form */}
        {editingProduct && (
          <div className="bg-black/20 rounded-xl p-6 mb-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">Edit Product: {editingProduct.name}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Minimum Investment</label>
                <input
                  type="number"
                  value={formData.minInvestment}
                  onChange={(e) => setFormData({ ...formData, minInvestment: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Maximum Investment</label>
                <input
                  type="number"
                  value={formData.maxInvestment}
                  onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Return Percentage (%)</label>
                <input
                  type="number"
                  value={formData.returnPercentage}
                  onChange={(e) => setFormData({ ...formData, returnPercentage: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Duration (Days)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Min Investment</th>
                <th className="py-3 px-4 text-left">Max Investment</th>
                <th className="py-3 px-4 text-left">Return %</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">PRD{product.id.toString().padStart(3, '0')}</td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">Rp {product.minInvestment.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4">Rp {product.maxInvestment.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4">{product.returnPercentage}%</td>
                  <td className="py-3 px-4">{product.duration} days</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      product.status === 'Active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Icon icon="mdi:pencil" className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}