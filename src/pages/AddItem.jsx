import { useState } from 'react'
import { delay } from '../services/dummyData'
import { ArrowLeft, Plus, Image as ImageIcon, X } from 'lucide-react'

export default function AddItem() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [subCategoryName, setSubCategoryName] = useState('')
  const [photos, setPhotos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [imagePreviews, setImagePreviews] = useState([])

  function handleImageChange(e) {
    const files = Array.from(e.target.files)
    setPhotos(e.target.files)
    
    // Create previews
    const previews = files.map(file => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }))
    setImagePreviews(previews)
  }

  function removeImage(index) {
    const newFiles = Array.from(photos).filter((_, i) => i !== index)
    const dataTransfer = new DataTransfer()
    newFiles.forEach(file => dataTransfer.items.add(file))
    setPhotos(dataTransfer.files)
    
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImagePreviews(newPreviews)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!name.trim() || !price || !description.trim() || !subCategoryName.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      
      // Reset form
      setName('')
      setPrice('')
      setDescription('')
      setSubCategoryName('')
      setPhotos(null)
      setImagePreviews([])
      
      setMessage({ type: 'success', text: 'Item added successfully!' })
      
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: 'Error adding item. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-2xl mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-xl shadow p-4">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Add Item</h1>
              <p className="text-gray-600 mt-2">
                Add a new furniture item to your collection
              </p>
            </div>

            {/* Status Messages */}
            {message.text && (
              <div className={`mb-6 p-3 rounded-full ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  placeholder="e.g., Wooden Office Chair"
                  disabled={loading}
                />
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-sm"
                  placeholder="Describe the item..."
                  rows="4"
                  disabled={loading}
                />
              </div>

              {/* Subcategory Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  placeholder="e.g., Sofas, Chairs, Tables"
                  disabled={loading}
                />
              </div>

              {/* Photos Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos {imagePreviews.length > 0 && `(${imagePreviews.length} selected)`}
                </label>
                
                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="w-full h-32 object-cover rounded-xl border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loading}
                    />
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 5MB each
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !price || !description.trim() || !subCategoryName.trim()}
                  className={`flex-1 py-2 px-4 rounded-full font-medium transition-colors text-sm flex items-center justify-center ${
                    loading || !name.trim() || !price || !description.trim() || !subCategoryName.trim()
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-3"></div>
                      Adding Item...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName('')
                    setPrice('')
                    setDescription('')
                    setSubCategoryName('')
                    setPhotos(null)
                    setImagePreviews([])
                    setMessage({ type: '', text: '' })
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </form>

            {/* Help Text */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Note:</span> Make sure the subcategory exists before adding items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}