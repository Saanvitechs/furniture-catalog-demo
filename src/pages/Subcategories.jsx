import { useEffect, useState } from 'react'
import { dummySubCategories, delay } from '../services/dummyData'

export default function Subcategories() {
  const [subs, setSubs] = useState([])

  useEffect(() => {
    fetchSubcategories()
  }, [])

  async function fetchSubcategories() {
    try {
      await delay(300)
      const allSubs = Object.values(dummySubCategories).flat()
      setSubs(allSubs || [])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="container py-8">
      <h2 className="text-2xl font-bold mb-4">SubCategories (sample)
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subs.map((s) => (
          <li key={s.id} className="bg-white p-4 rounded shadow">{s.name || s.subCategoryName || 'Unnamed'}</li>
        ))}
      </ul>
    </main>
  )
}
