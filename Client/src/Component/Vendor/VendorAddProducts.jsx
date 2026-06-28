import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CloseCircle } from 'iconsax-react'
import Loader from '../Loader/Loader'
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'


function VendorAddProducts() {
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState(null)
  const [responseMsg, setresponseMsg] = useState('')
  const [images, setImages] = useState([])
  const [loader, setloader] = useState(false)
  const [objformData, setObjFormData] = useState({
    productName: '',
    category: '',
    brand: '',
    unit: '500 ml',
    sellingPrice: '',
    mrp: '',
    stockQuantity: '',
    minOrderQuantity: '1',
    description: '',
    status: 'Active',
  })

  const categories = ['Dairy & Eggs', 'Fruits & Vegetables', 'Staples', 'Beverages', 'Snack & Biscuits', 'Personal Care']
  const units = ['500 ml', '1 L', '1 kg', '2 kg', '500 g', '250 g', '100 g', '5 kg', '10 pcs','5 pcs', '200 g','none']

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)

    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages([event.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePublish = async () => {
    setloader(true)
    setresponseMsg('')

    if (!selectedFile) {
      setresponseMsg('Please choose an image file to upload.')
      setloader(false)
      return
    }

    if (!objformData.productName || !objformData.category || !objformData.sellingPrice || !objformData.mrp || !objformData.stockQuantity || !objformData.status) {
      setresponseMsg('Please fill the required value.')
      setloader(false)
      return
    }

    const formData = new FormData()
    formData.append("productName", objformData.productName)
    formData.append("category", objformData.category)
    formData.append("brand", objformData.brand)
    formData.append("unit", objformData.unit)
    formData.append("sellingPrice", objformData.sellingPrice)
    formData.append("mrp", objformData.mrp)
    formData.append("stockQuantity", objformData.stockQuantity)
    formData.append("minOrderQuantity", objformData.minOrderQuantity)
    formData.append("description", objformData.description)
    formData.append("status", objformData.status)
    formData.append("image", selectedFile)

    try {
      const res = await fetch(`${API_BASE}/vendor/add_product`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.msg || data.error || `HTTP error! status: ${res.status}`);
      }

      setresponseMsg(data.msg);
    } catch (err) {
      setresponseMsg(err.message || 'Network error')
    } finally {
      setloader(false)
    }

    // console.log(Array.from(formData.entries()))
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setObjFormData({ ...objformData, [name]: value })
  }

  const handleStatusChange = (status) => {
    setObjFormData({ ...objformData, status })
  }

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData)
    // Add API call here
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-slate-200">
            <ArrowLeft size={24} color="currentColor" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Add New Product</h1>
            <p className="mt-1 text-sm text-slate-600">
              <span className="cursor-pointer hover:text-emerald-600">Dashboard</span>
              <span className="mx-2 text-slate-400">›</span>
              <span className="cursor-pointer hover:text-emerald-600">Products</span>
              <span className="mx-2 text-slate-400">›</span>
              <span className="text-emerald-600">Add New Product</span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Product Images *</h2>
              <p className="mb-4 text-sm text-slate-600">Only one image upload</p>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-5">
                <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:bg-slate-100">
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
                  <div className="text-center">
                    <div className="text-3xl text-slate-400">+</div>
                    <p className="mt-2 text-xs font-semibold text-slate-700">Upload Image</p>
                    <p className="text-xs text-slate-500">JPG, PNG (Max. 5MB)</p>
                  </div>
                </label>
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    {index === 0 && (
                      <div className="absolute -top-2 left-2 inline-flex rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">
                        Primary
                      </div>
                    )}
                    <img src={image} alt={`Product ${index + 1}`} className="h-32 w-full rounded-2xl object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-3 -right-3 rounded-full bg-white p-1 shadow-md hover:bg-slate-50"
                    >
                      <CloseCircle size={20} color="#ef4444" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">Tip: First image will be the product cover image.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Product Name *</label>
                  <input
                    type="text"
                    name="productName"
                    value={objformData.productName}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Category *</label>
                  <select
                    name="category"
                    value={objformData.category}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={objformData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Unit</label>
                  <select
                    name="unit"
                    value={objformData.unit}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Selling Price *</label>
                  <div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-slate-600">₹</span>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={objformData.sellingPrice}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">MRP</label>
                  <div className="mt-2 flex items-center rounded-2xl border border-slate-200 px-4 py-3">
                    <span className="text-slate-600">₹</span>
                    <input
                      type="number"
                      name="mrp"
                      value={objformData.mrp}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={objformData.stockQuantity}
                    onChange={handleInputChange}
                    placeholder="Enter quantity"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900">Minimum Order Quantity</label>
                  <input
                    type="number"
                    name="minOrderQuantity"
                    value={objformData.minOrderQuantity}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="block text-sm font-semibold text-slate-900">Product Description *</label>
              <textarea
                name="description"
                value={objformData.description}
                onChange={handleInputChange}
                placeholder="Write product description..."
                rows="6"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <div className="mt-2 text-right text-xs text-slate-500">
                {objformData.description.length}/500
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <p className='font-bold'>{responseMsg}</p>
              {/* <button
                onClick={() => navigate(-1)}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDraft}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-100"
              >
                Save as Draft
              </button> */}
              {
                loader ? <button className="rounded-2xl bg-emerald-600 cursor-not-allowed px-6 py-3 font-semibold text-white hover:bg-emerald-700">
                  <Loader size={28} color='white' />
                </button> :
                  <button
                    onClick={handlePublish}
                    className="rounded-2xl bg-emerald-600 cursor-pointer px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                  >
                    Publish Product
                  </button>
              }
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Product Status</h3>
              <div className="mt-4 space-y-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="Active"
                    checked={objformData.status === 'Active'}
                    onChange={() => handleStatusChange('Active')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">Active</p>
                    <p className="text-xs text-slate-600">Product will be visible to all customers</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="Inactive"
                    checked={objformData.status === 'Inactive'}
                    onChange={() => handleStatusChange('Inactive')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">Inactive</p>
                    <p className="text-xs text-slate-600">Product will be hidden from customers</p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="status"
                    value="Out of Stock"
                    checked={objformData.status === 'Out of Stock'}
                    onChange={() => handleStatusChange('Out of Stock')}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">Out of Stock</p>
                    <p className="text-xs text-slate-600">Product stock is 0</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VendorAddProducts
