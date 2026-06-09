import { useEffect, useState } from 'react';

function AssetManagement() {
  const [assets, setAssets] = useState([]);

  const [formData, setFormData] = useState({
    asset_code: '',
    asset_name: '',
    asset_type: '',
    purchase_date: '',
    purchase_cost: ''
  });

  const fetchAssets = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/assets'
      );

      const data = await response.json();

      setAssets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

useEffect(() => {
  const load = async () => {
    await fetchAssets();
  };

  load();
}, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await fetch(
        'http://localhost:5000/api/assets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      setFormData({
        asset_code: '',
        asset_name: '',
        asset_type: '',
        purchase_date: '',
        purchase_cost: ''
      });

      fetchAssets();

      alert('Asset Created Successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold">
          Asset Management
        </h1>

        <p className="mt-2 text-indigo-100">
          Manage laptops, monitors, ID cards and company assets
        </p>
      </div>

      {/* ADD ASSET FORM */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Add New Asset
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Asset Code"
            value={formData.asset_code}
            onChange={(e) =>
              setFormData({
                ...formData,
                asset_code: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Asset Name"
            value={formData.asset_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                asset_name: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="text"
            placeholder="Asset Type"
            value={formData.asset_type}
            onChange={(e) =>
              setFormData({
                ...formData,
                asset_type: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="date"
            value={formData.purchase_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchase_date: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            placeholder="Purchase Cost"
            value={formData.purchase_cost}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchase_cost: e.target.value
              })
            }
            className="border p-3 rounded-xl"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-xl px-6 py-3 hover:bg-indigo-700"
          >
            Add Asset
          </button>
        </form>

      </div>

      {/* ASSET TABLE */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Company Assets
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Code</th>
              <th className="text-left py-3">Name</th>
              <th className="text-left py-3">Type</th>
              <th className="text-left py-3">Cost</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="py-3">
                  {asset.asset_code}
                </td>

                <td className="py-3">
                  {asset.asset_name}
                </td>

                <td className="py-3">
                  {asset.asset_type}
                </td>

                <td className="py-3">
                  ₹{asset.purchase_cost}
                </td>

                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      asset.status === 'Allocated'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {asset.status}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AssetManagement;