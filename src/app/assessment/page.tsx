'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getAssessments, createAssessment, deleteAssessment } from './actions'
import EmptyState from '@/components/EmptyState'
import Link from 'next/link'

export default function AssessmentPage() {
  const { isAdmin, user } = useRole()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState([{ q: '', options: ['', '', '', ''], correct: 0 }])

  const load = async () => { setAssessments(await getAssessments()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createAssessment(fd)
    if (r?.error) setError(r.error); else { setShowAddModal(false); load() }
  }

  if (loading) return <div className="w-full max-w-7xl mx-auto flex items-center justify-center py-20"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  // Group assessments by type dynamically
  const groupedAssessments = assessments.reduce((acc: any, cur: any) => {
    const type = cur.type || 'Uncategorized'
    if (!acc[type]) acc[type] = []
    acc[type].push(cur)
    return acc
  }, {})

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Assessments
          </h2>
          <p className="mt-2 ml-5 font-semibold" style={{ color: '#64748b' }}>Track your formative and summative assessments.</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setError(null); setQuestions([{ q: '', options: ['', '', '', ''], correct: 0 }]); setShowAddModal(true) }} className="btn-primary-gradient px-4 py-2.5 rounded-xl text-sm font-bold shadow-md flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Add Assessment
          </button>
        )}
      </div>

      {assessments.length === 0 ? (
        <EmptyState icon="fa-clipboard-list" title="No Assessments Yet" description="No assessments have been created. Admins can add assessments to track student performance." actionLabel={isAdmin ? 'Add Assessment' : undefined} onAction={isAdmin ? () => setShowAddModal(true) : undefined} />
      ) : (
        <>
          {Object.keys(groupedAssessments).map(type => (
            <div key={type} className="bg-white rounded-2xl p-6 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: '#1e293b' }}>
                <i className="fas fa-layer-group" style={{ color: '#2563eb' }}></i> {type}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                      <th className="py-3 px-4 font-semibold" style={{ color: '#475569' }}>Name</th>
                      <th className="py-3 px-4 font-semibold" style={{ color: '#475569' }}>Score</th>
                      <th className="py-3 px-4 font-semibold" style={{ color: '#475569' }}>Weight</th>
                      <th className="py-3 px-4 font-semibold" style={{ color: '#475569' }}>Status</th>
                      <th className="py-3 px-4 font-semibold" style={{ color: '#475569' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedAssessments[type].map((a: any) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td className="py-3 px-4 font-medium" style={{ color: '#1e293b' }}>{a.name}</td>
                        <td className="py-3 px-4 font-bold" style={{ color: '#2563eb' }}>{a.score || '-'}</td>
                        <td className="py-3 px-4" style={{ color: '#64748b' }}>{a.weight}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: a.status === 'Graded' ? '#ecfdf5' : '#fffbeb', color: a.status === 'Graded' ? '#059669' : '#d97706' }}>{a.status}</span>
                        </td>
                        <td className="py-3 px-4 flex gap-3 items-center">
                          {a.status === 'Pending' && (
                            <Link href={`/assessment/${a.id}/take`} className="text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', textDecoration: 'none' }}><i className="fas fa-check mr-1"></i>Take Assessment</Link>
                          )}
                          {isAdmin && <button onClick={() => deleteAssessment(a.id).then(load)} style={{ color: '#ef4444' }} className="text-xs font-bold"><i className="fas fa-trash-alt mr-1"></i>Delete</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center shrink-0" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h2 className="text-xl font-bold" style={{ color: '#1e293b' }}><i className="fas fa-plus-circle mr-2" style={{ color: '#2563eb' }}></i>Add Assessment</h2>
              <button onClick={() => setShowAddModal(false)} style={{ color: '#64748b' }}><i className="fas fa-times"></i></button>
            </div>
            {error && <div className="mx-6 mt-4 p-3 rounded-xl text-sm shrink-0" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>}
            <form onSubmit={handleCreate} className="p-6 space-y-6 overflow-y-auto">
              <input type="hidden" name="questions" value={JSON.stringify(questions)} />
              
              <div className="space-y-4">
                <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Name *</label><input required name="name" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Quiz 1" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Duration (Mins) *</label><input required name="duration" type="number" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. 30" /></div>
                  <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Weight</label><input name="weight" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. 20%" /></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div><label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Type</label><input required name="type" className="w-full px-4 py-2 border rounded-lg text-sm" style={{ borderColor: '#e2e8f0', color: '#1e293b' }} placeholder="e.g. Midterm, Project, Practical" /></div>
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-lg" style={{ color: '#1e293b' }}>Questions</h3>
                   <button type="button" onClick={() => setQuestions([...questions, { q: '', options: ['', '', '', ''], correct: 0 }])} className="text-sm font-semibold px-3 py-1.5 rounded-lg border bg-slate-50 hover:bg-slate-100 transition-colors" style={{ color: '#334155', borderColor: '#cbd5e1' }}><i className="fas fa-plus mr-1"></i>Add Question</button>
                </div>
                
                <div className="space-y-6">
                  {questions.map((q, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-slate-50 space-y-3 shadow-sm" style={{ borderColor: '#e2e8f0' }}>
                      <div className="flex justify-between items-start">
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#334155' }}>Question {i + 1} *</label>
                        {questions.length > 1 && <button type="button" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>}
                      </div>
                      <input required value={q.q} onChange={e => { const newQ = [...questions]; newQ[i].q = e.target.value; setQuestions(newQ) }} className="w-full px-4 py-2 border rounded-lg text-sm bg-white" style={{ borderColor: '#cbd5e1', color: '#1e293b' }} placeholder="Enter question text..." />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {q.options.map((opt, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <input type="radio" checked={q.correct === j} onChange={() => { const newQ = [...questions]; newQ[i].correct = j; setQuestions(newQ) }} className="w-4 h-4 cursor-pointer" style={{ accentColor: '#3b82f6' }} title="Mark as correct answer" />
                            <input required value={opt} onChange={e => { const newQ = [...questions]; newQ[i].options[j] = e.target.value; setQuestions(newQ) }} className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" style={{ borderColor: q.correct === j ? '#3b82f6' : '#cbd5e1' }} placeholder={`Option ${j + 1}`} />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs italic text-slate-500 mt-1">Select the radio button next to the correct option.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3 shrink-0" style={{ borderColor: '#e2e8f0' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 rounded-xl text-sm font-semibold border" style={{ color: '#475569', borderColor: '#e2e8f0' }}>Cancel</button>
                <button type="submit" className="btn-primary-gradient px-5 py-2 rounded-xl text-sm font-semibold shadow-md">Save Assessment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
