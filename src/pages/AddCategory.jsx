import { useState } from 'react'
import { delay } from '../services/dummyData'

export default function CategoryManager() {
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('add') // add | update
  const [message, setMessage] = useState({ type: '', text: '' })

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  function resetForm() {
    setCategoryId('')
    setName('')
    removeImage()
    setMessage({ type: '', text: '' })
    setMode('add')
  }

  async function handleAdd(e) {
    e.preventDefault()

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Category name is required.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Category added successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add category' })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdate() {
    if (!categoryId || !name.trim()) {
      setMessage({ type: 'error', text: 'Category ID and name are required.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Category updated successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update category' })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!categoryId) {
      setMessage({ type: 'error', text: 'Category ID is required.' })
      return
    }

    const confirm = window.confirm('Are you sure you want to delete this category?')
    if (!confirm) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Category deleted successfully.' })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete category' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Category Management
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setMode('add')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    mode === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setMode('update')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    mode === 'update' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  Update / Delete
                </button>
              </div>
            </div>

            {message.text && (
              <div
                className={`mb-4 p-3 rounded-full ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {mode === 'update' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category ID
                  </label>
                  <input
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2 border rounded-full text-sm"
                    placeholder="Enter category ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-full text-sm"
                  placeholder="e.g. Luxury Sofas"
                  disabled={loading}
                />
              </div>

              {mode === 'add' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Image (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer px-4 py-2 border rounded-full text-sm">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      Choose Image
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-sm text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="mt-3 w-40 h-28 object-cover rounded-xl border"
                    />
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {mode === 'add' ? (
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
                  >
                    {loading ? 'Adding...' : 'Add Category'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Delete
                    </button>
                  </>
                )}

                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-4 py-2 rounded-full border text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}