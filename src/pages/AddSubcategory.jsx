import { useState } from 'react'
import { delay } from '../services/dummyData'
import { ArrowLeft, Plus, Trash2, Edit } from 'lucide-react'

export default function SubcategoryManager() {
  const [mode, setMode] = useState('add') // add | update
  const [subcategoryId, setSubcategoryId] = useState('')
  const [name, setName] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function resetForm() {
    setSubcategoryId('')
    setName('')
    setCategoryName('')
    removeImage()
    setMessage({ type: '', text: '' })
    setMode('add')
  }

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

  /* ---------------- ADD ---------------- */
  async function handleAdd(e) {
    e.preventDefault()

    if (!name.trim() || !categoryName.trim()) {
      setMessage({ type: 'error', text: 'All fields are required.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Subcategory added successfully.' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to add subcategory',
      })
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UPDATE ---------------- */
  async function handleUpdate() {
    if (!subcategoryId || !name.trim()) {
      setMessage({ type: 'error', text: 'Subcategory ID and name are required.' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Subcategory updated successfully.' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to update subcategory',
      })
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- DELETE ---------------- */
  async function handleDelete() {
    if (!subcategoryId) {
      setMessage({ type: 'error', text: 'Subcategory ID is required.' })
      return
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this subcategory?'
    )
    if (!confirmDelete) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await delay(500)
      resetForm()
      setMessage({ type: 'success', text: 'Subcategory deleted successfully.' })
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to delete subcategory',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 py-6 px-2 sm:px-4 lg:px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="max-w-md mx-auto">
          {/* Back */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="bg-white rounded-xl shadow p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Subcategory Management
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setMode('add')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    mode === 'add'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Add
                </button>
                <button
                  onClick={() => setMode('update')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    mode === 'update'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  Update / Delete
                </button>
              </div>
            </div>

            {/* Messages */}
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-full ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {mode === 'update' && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Subcategory ID
                  </label>
                  <input
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    className="w-full p-2 border rounded-full text-sm"
                    placeholder="Enter subcategory ID"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subcategory Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-full text-sm"
                  placeholder="e.g. Premium Chairs"
                  disabled={loading}
                />
              </div>

              {mode === 'add' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Category Name
                    </label>
                    <input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full p-2 border rounded-full text-sm"
                      placeholder="e.g. Living Room"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image (optional)
                    </label>
                    <div className="flex gap-4">
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
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {mode === 'add' ? (
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {loading ? 'Adding...' : 'Add Subcategory'}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </>
                )}

                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-4 py-2 border rounded-full text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-6 border-t pt-4">
              <strong>Note:</strong> Parent category must exist before adding a
              subcategory.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}