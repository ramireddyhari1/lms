'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAssessment, completeAssessment } from '../../actions'

export default function TakeAssessmentPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [answers, setAnswers] = useState<any>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getAssessment(id)
      if (data) {
        setAssessment(data)
        const durationMins = parseInt(data.duration || '30')
        setTimeLeft(durationMins * 60)
      } else {
        router.push('/assessment')
      }
      setLoading(false)
    }
    load()
  }, [id, router])

  useEffect(() => {
    if (loading || submitting || timeLeft <= 0) return
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerId)
  }, [loading, submitting, timeLeft])

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    await completeAssessment(id, answers)
    router.push('/assessment')
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (loading) return <div className="w-full h-96 flex items-center justify-center"><i className="fas fa-spinner fa-spin text-3xl" style={{ color: '#94a3b8' }}></i></div>

  const questions = assessment?.questions || []

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Sticky Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 sticky top-4 z-50 backdrop-blur-md bg-white/90">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>{assessment?.name}</h1>
          <p className="text-sm font-semibold mt-1" style={{ color: '#64748b' }}>
            {assessment?.type === 'FA' ? 'Formative Assessment' : 'Summative Assessment'} &bull; Weight: {assessment?.weight}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 rounded-xl border-2 flex items-center gap-3 font-mono text-xl font-bold transition-colors shadow-sm" style={{ 
            backgroundColor: timeLeft < 300 ? '#fef2f2' : '#ffffff',
            borderColor: timeLeft < 300 ? '#ef4444' : '#e2e8f0', 
            color: timeLeft < 300 ? '#ef4444' : '#1e293b' 
          }}>
            <i className={`far fa-clock ${timeLeft < 300 ? 'animate-pulse' : ''}`}></i>
            {formatTime(timeLeft)}
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary-gradient px-6 py-3 rounded-xl font-bold text-white shadow-md disabled:opacity-50 hover:shadow-lg transition-all flex items-center gap-2">
            {submitting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>

      {/* Quiz Body */}
      <div className="space-y-6">
        {questions.length === 0 ? (
           <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
             <i className="fas fa-clipboard-question text-4xl mb-3" style={{ color: '#94a3b8' }}></i>
             <h3 className="text-xl font-bold" style={{ color: '#1e293b' }}>No Questions Found</h3>
             <p className="text-sm font-semibold mt-2" style={{ color: '#64748b' }}>This assessment does not have any configured questions.</p>
           </div>
        ) : questions.map((q: any, i: number) => {
          const options = typeof q.options === 'string' ? JSON.parse(q.options) : q.options || []
          return (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold mb-5" style={{ color: '#1e293b' }}>{i + 1}. {q.text || q.q}</h3>
            <div className="space-y-3">
              {options.map((opt: string, j: number) => (
                <label key={j} className="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:bg-slate-50 relative overflow-hidden" style={{ 
                  backgroundColor: answers[i] === j ? '#eff6ff' : '#ffffff', 
                  borderColor: answers[i] === j ? '#3b82f6' : '#e2e8f0' 
                }}>
                  {answers[i] === j && <div className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: '#3b82f6' }}></div>}
                  <input type="radio" name={`question-${i}`} className="w-5 h-5" style={{ accentColor: '#3b82f6' }}
                    checked={answers[i] === j}
                    onChange={() => setAnswers({...answers, [i]: j})}
                  />
                  <span className="font-semibold text-base" style={{ color: answers[i] === j ? '#1d4ed8' : '#475569' }}>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}
