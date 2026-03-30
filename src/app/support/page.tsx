'use client'

import { useState, useEffect } from 'react'
import { useRole } from '@/components/RoleContext'
import { getTickets, createTicket } from './actions'

const FAQS = [
  { id: 1, question: "How do I reset my password?", answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password securely." },
  { id: 2, question: "What should I do if I'm having technical issues?", answer: "If you're experiencing technical issues, please try refreshing the page first or clearing your browser cache. If the problem persists, use the 'Raise Ticket' feature on this page to report the issue directly to our technical support team." },
  { id: 3, question: "How do I access my certificates once a course is completed?", answer: "Once a course or program hits 100% completion, your certificate will be automatically generated. You can find them in the 'Certificates' section in the sidebar, where you can download or share them." }
]

export default function SupportPage() {
  const { user } = useRole()
  const [openFaq, setOpenFaq] = useState<number>(1)
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitMsg, setSubmitMsg] = useState<string | null>(null)

  const load = async () => { setTickets(await getTickets()); setLoading(false) }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setSubmitMsg(null)
    const fd = new FormData(e.currentTarget); fd.set('userId', user?.id || '')
    const r = await createTicket(fd)
    if (r?.error) setSubmitMsg(r.error)
    else { setSubmitMsg('Ticket submitted successfully!'); (e.target as HTMLFormElement).reset(); load() }
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3" style={{ color: '#1e293b' }}>
          <div className="w-2 h-8 rounded-full" style={{ backgroundColor: '#2563eb' }}></div> Help & Support
        </h2>
        <p className="mt-2 ml-5" style={{ color: '#64748b' }}>Find answers to common questions or reach out to our team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* FAQs */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border" style={{ borderColor: '#e2e8f0' }}>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <i className="fas fa-question-circle" style={{ color: '#3b82f6' }}></i> Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {FAQS.map(faq => (
                <div key={faq.id} className="border rounded-xl overflow-hidden transition-all duration-300" style={{ borderColor: openFaq === faq.id ? '#bfdbfe' : '#e2e8f0', backgroundColor: openFaq === faq.id ? '#f0f7ff' : '#fff' }}>
                  <button onClick={() => setOpenFaq(openFaq === faq.id ? 0 : faq.id)} className="w-full text-left px-5 py-4 flex justify-between items-center gap-4">
                    <span className="font-semibold text-sm" style={{ color: openFaq === faq.id ? '#1d4ed8' : '#334155' }}>{faq.question}</span>
                    <i className={`fas fa-chevron-down text-sm transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`} style={{ color: openFaq === faq.id ? '#3b82f6' : '#94a3b8' }}></i>
                  </button>
                  <div className={`px-5 overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm leading-relaxed m-0 pt-3" style={{ color: '#475569', borderTop: '1px solid #dbeafe' }}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raise Ticket */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border relative overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: '#1e293b' }}>
              <i className="fas fa-headset" style={{ color: '#6366f1' }}></i> Raise a Ticket
            </h3>
            {submitMsg && <div className="mb-4 p-3 rounded-xl text-sm font-medium" style={{ backgroundColor: submitMsg.includes('success') ? '#ecfdf5' : '#fef2f2', color: submitMsg.includes('success') ? '#059669' : '#dc2626' }}>{submitMsg}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Title</label><input required name="subject" className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: '#e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc' }} placeholder="Brief description of your issue" /></div>
              <div><label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Category</label><select name="category" className="w-full px-4 py-2.5 rounded-xl border text-sm font-medium" style={{ borderColor: '#e2e8f0', color: '#334155', backgroundColor: '#f8fafc' }}><option>Technical Issue</option><option>Content Question</option><option>Account Problem</option><option>Other</option></select></div>
              <div><label className="block text-sm font-semibold mb-1.5" style={{ color: '#334155' }}>Description</label><textarea name="description" className="w-full px-4 py-3 rounded-xl border text-sm font-medium resize-y" style={{ borderColor: '#e2e8f0', color: '#1e293b', backgroundColor: '#f8fafc' }} rows={5} placeholder="Please provide detailed information about your issue."></textarea></div>
              <div className="pt-2"><button type="submit" className="btn-primary-gradient px-8 py-3 rounded-xl text-sm font-semibold shadow-md flex items-center gap-2"><i className="fas fa-paper-plane"></i> Submit Ticket</button></div>
            </form>
          </div>
        </div>

        {/* Sidebar - My Tickets */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col" style={{ borderColor: '#e2e8f0' }}>
            <div className="p-6 border-b" style={{ borderColor: '#f1f5f9', backgroundColor: '#fafbfc' }}>
              <h3 className="text-lg font-bold m-0 flex items-center gap-2" style={{ color: '#1e293b' }}><i className="fas fa-ticket-alt" style={{ color: '#f59e0b' }}></i> My Tickets</h3>
            </div>
            <div className="flex-1 p-2">
              {loading ? (
                <div className="text-center py-10"><i className="fas fa-spinner fa-spin" style={{ color: '#94a3b8' }}></i></div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <i className="fas fa-inbox text-4xl mb-3 block" style={{ color: '#e2e8f0' }}></i>
                  <p className="text-sm font-medium" style={{ color: '#64748b' }}>No support tickets found.</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="p-4 border-b last:border-0 hover:bg-slate-50 transition-colors" style={{ borderColor: '#f1f5f9' }}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>{ticket.ticketId}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: ticket.status === 'Resolved' ? '#ecfdf5' : '#fffbeb', color: ticket.status === 'Resolved' ? '#059669' : '#d97706' }}>{ticket.status}</span>
                    </div>
                    <div className="font-semibold text-sm mb-2 line-clamp-2" style={{ color: '#1e293b' }}>{ticket.subject}</div>
                    <div className="text-xs font-medium flex items-center gap-1.5" style={{ color: '#94a3b8' }}><i className="far fa-calendar-alt"></i> {new Date(ticket.createdAt).toLocaleDateString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
