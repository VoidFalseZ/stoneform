// pages/admin/settings.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Icon } from '@iconify/react';
import AdminLayout from '../../components/admin/Layout';
import useAdminAuth from '../../lib/auth/useAdminAuth';

export default function AdminSettings() {
  const { loading: authLoading } = useAdminAuth();
  const [settings, setSettings] = useState({
    siteName: 'Stoneform Capital',
    minWithdraw: 50000,
    maxWithdraw: 10000000,
    withdrawCharge: 2500,
    csLink: 'https://wa.me/628123456789',
    groupLink: 'https://t.me/stoneformgroup',
    appLink: 'https://play.google.com/store/apps/details?id=com.stoneform.app'
  });
  const [loading, setLoading] = useState(true);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    
    // In a real app, this would fetch settings from an API
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save settings via API
    alert('Settings saved successfully!');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="System Settings">
      <Head>
        <title>Stoneform Capital | System Settings</title>
      </Head>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
        <h2 className="text-white text-xl font-semibold mb-6">System Settings</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Site Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <Icon icon="mdi:image" className="text-gray-400 w-8 h-8" />
                )}
              </div>
              <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl cursor-pointer">
                <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                Upload Logo
              </label>
            </div>
          </div>

          {/* Site Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Withdrawal Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Minimum Withdrawal</label>
              <input
                type="number"
                name="minWithdraw"
                value={settings.minWithdraw}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Maximum Withdrawal</label>
              <input
                type="number"
                name="maxWithdraw"
                value={settings.maxWithdraw}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Withdrawal Charge</label>
              <input
                type="number"
                name="withdrawCharge"
                value={settings.withdrawCharge}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Customer Service Link</label>
              <input
                type="url"
                name="csLink"
                value={settings.csLink}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Group Link</label>
              <input
                type="url"
                name="groupLink"
                value={settings.groupLink}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">App Download Link</label>
              <input
                type="url"
                name="appLink"
                value={settings.appLink}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}