const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...\n')

  // ── Admin User ──
  const hashedPassword = await bcrypt.hash('admin@Flippedlearn', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { fullName: 'Hari Haran', email: 'admin@flippedlearn.com', phone: '+91 98765 43210', bio: 'Platform administrator and learning architect at FlippedLearn.', location: 'Hyderabad, India', company: 'FlippedLearn', title: 'Platform Administrator' },
    create: { username: 'admin', password: hashedPassword, role: 'admin', fullName: 'Hari Haran', email: 'admin@flippedlearn.com', phone: '+91 98765 43210', bio: 'Platform administrator and learning architect at FlippedLearn.', location: 'Hyderabad, India', company: 'FlippedLearn', title: 'Platform Administrator' },
  })
  console.log('✅ Admin user created/updated')

  // ── Student User ──
  const studentPassword = await bcrypt.hash('student@123', 10)
  const student = await prisma.user.upsert({
    where: { username: 'student' },
    update: {},
    create: { username: 'student', password: studentPassword, role: 'user', fullName: 'Arun Kumar', email: 'arun.kumar@student.flippedlearn.com', phone: '+91 87654 32109', bio: 'Final year B.Tech CSE student passionate about full-stack development and AI.', location: 'Chennai, India', company: 'VIT University', title: 'B.Tech CSE Student' },
  })
  console.log('✅ Student user created')

  // ── Courses ──
  const courses = [
    { title: 'The Complete Web Developer Bootcamp 2025', category: 'Full Stack', level: 'Beginner', duration: '63h 30m', lessons: 84, instructor: 'Dr. Angela Yu', progress: 72, status: 'ongoing', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80', userId: admin.id },
    { title: 'React – The Complete Guide (incl. Next.js)', category: 'Frontend', level: 'Intermediate', duration: '48h 15m', lessons: 68, instructor: 'Maximilian Schwarzmüller', progress: 45, status: 'ongoing', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80', userId: admin.id },
    { title: 'Machine Learning A-Z: AI & Python', category: 'Data Science', level: 'Intermediate', duration: '44h 00m', lessons: 56, instructor: 'Kirill Eremenko', progress: 100, status: 'completed', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80', userId: admin.id },
    { title: 'Node.js, Express, MongoDB & More', category: 'Backend', level: 'Advanced', duration: '42h 00m', lessons: 52, instructor: 'Jonas Schmedtmann', progress: 88, status: 'ongoing', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80', userId: admin.id },
    { title: 'Meta Front-End Developer Certificate', category: 'Frontend', level: 'Beginner', duration: '36h 45m', lessons: 44, instructor: 'Meta Staff', progress: 100, status: 'completed', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80', userId: admin.id },
    { title: 'CS50 – Introduction to Computer Science', category: 'CS Fundamentals', level: 'Beginner', duration: '25h 00m', lessons: 36, instructor: 'Prof. David J. Malan', progress: 100, status: 'completed', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', userId: admin.id },
    { title: 'IBM Data Science Professional Certificate', category: 'Data Science', level: 'Beginner', duration: '52h 00m', lessons: 72, instructor: 'IBM Skills Network', progress: 30, status: 'ongoing', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', userId: admin.id },
    { title: 'AWS Cloud Practitioner Essentials', category: 'Cloud', level: 'Beginner', duration: '18h 30m', lessons: 24, instructor: 'AWS Training', progress: 0, status: 'upcoming', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80', userId: admin.id },
    { title: 'Python for Data Structures & Algorithms', category: 'DSA', level: 'Intermediate', duration: '32h 00m', lessons: 48, instructor: 'Jose Portilla', progress: 60, status: 'ongoing', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', userId: admin.id },
    { title: 'Docker & Kubernetes – The Practical Guide', category: 'DevOps', level: 'Advanced', duration: '23h 45m', lessons: 28, instructor: 'Maximilian Schwarzmüller', progress: 0, status: 'upcoming', image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&q=80', userId: admin.id },
  ]
  await prisma.course.createMany({ data: courses })
  console.log(`✅ ${courses.length} courses created`)

  // ── Assessments ──
  const assessments = [
    { name: 'HTML & CSS Fundamentals Quiz', type: 'FA', score: '92/100', weight: '10%', status: 'Graded', userId: admin.id },
    { name: 'JavaScript Basics Test', type: 'FA', score: '88/100', weight: '10%', status: 'Graded', userId: admin.id },
    { name: 'React Component Architecture', type: 'FA', score: '76/100', weight: '15%', status: 'Graded', userId: admin.id },
    { name: 'REST API Design Assessment', type: 'FA', score: null, weight: '10%', status: 'Pending', userId: admin.id },
    { name: 'Database Design & SQL', type: 'FA', score: null, weight: '15%', status: 'Upcoming', userId: admin.id },
    { name: 'Mid-Semester Examination', type: 'SA', score: '168/200', weight: '30%', status: 'Graded', userId: admin.id },
    { name: 'End-Semester Theory Exam', type: 'SA', score: null, weight: '40%', status: 'Upcoming', userId: admin.id },
    { name: 'Comprehensive Viva Voce', type: 'SA', score: null, weight: '20%', status: 'Upcoming', userId: admin.id },
    { name: 'Practical Lab Examination', type: 'SA', score: '45/50', weight: '10%', status: 'Graded', userId: admin.id },
  ]
  await prisma.assessment.createMany({ data: assessments })
  console.log(`✅ ${assessments.length} assessments created`)

  // ── Assignments ──
  const assignments = [
    { title: 'Build a Responsive Portfolio Website', type: 'Individual', course: 'Web Development Bootcamp', dueDate: '15 Apr 2025', points: 100, progress: 100, status: 'Graded', userId: admin.id },
    { title: 'E-Commerce REST API with Node.js', type: 'Individual', course: 'Node.js & Express', dueDate: '22 Apr 2025', points: 150, progress: 85, status: 'In Progress', userId: admin.id },
    { title: 'React Dashboard with Charts', type: 'Group', course: 'React Complete Guide', dueDate: '28 Apr 2025', points: 200, progress: 60, status: 'In Progress', userId: admin.id },
    { title: 'Machine Learning Model – House Price Prediction', type: 'Individual', course: 'Machine Learning A-Z', dueDate: '05 May 2025', points: 250, progress: 100, status: 'Graded', userId: admin.id },
    { title: 'SQL Query Optimization Challenge', type: 'Lab', course: 'Database Design & SQL', dueDate: '10 May 2025', points: 100, progress: 0, status: 'Pending', userId: admin.id },
    { title: 'Microservices Architecture Design Doc', type: 'Group', course: 'Node.js & Express', dueDate: '18 May 2025', points: 200, progress: 30, status: 'In Progress', userId: admin.id },
    { title: 'CI/CD Pipeline Setup with GitHub Actions', type: 'Individual', course: 'DevOps Fundamentals', dueDate: '25 May 2025', points: 150, progress: 0, status: 'Pending', userId: admin.id },
    { title: 'Data Visualization with Python & Matplotlib', type: 'Individual', course: 'IBM Data Science', dueDate: '01 Jun 2025', points: 120, progress: 0, status: 'Pending', userId: admin.id },
  ]
  await prisma.assignment.createMany({ data: assignments })
  console.log(`✅ ${assignments.length} assignments created`)

  // ── Projects ──
  const projects = [
    { title: 'FlippedLearn LMS Platform', subtitle: 'A modern Learning Management System built with Next.js, Prisma, and SQLite.', type: 'Industry', company: 'FlippedLearn', year: '2025', status: 'active', progress: 75, role: 'Full Stack Developer', techStack: 'Next.js,React,Prisma,SQLite,Tailwind CSS', userId: admin.id },
    { title: 'HealthTrack – Patient Management System', subtitle: 'End-to-end hospital management solution with appointment scheduling, patient records, and billing.', type: 'Team', company: 'VIT Capstone', year: '2025', status: 'active', progress: 55, role: 'Backend Lead', techStack: 'Node.js,Express,PostgreSQL,Docker,Redis', userId: admin.id },
    { title: 'AI Resume Analyzer', subtitle: 'NLP-powered tool that analyzes resumes against job descriptions and provides match scores.', type: 'Personal', company: null, year: '2024', status: 'completed', progress: 100, role: 'Solo Developer', techStack: 'Python,Flask,spaCy,OpenAI API,React', userId: admin.id },
    { title: 'E-Commerce Marketplace', subtitle: 'Multi-vendor marketplace with payment integration, order tracking, and admin analytics.', type: 'Team', company: 'Hackathon Project', year: '2024', status: 'completed', progress: 100, role: 'Frontend Developer', techStack: 'React,Redux,Stripe,Firebase,Tailwind CSS', userId: admin.id },
    { title: 'Smart Campus IoT Dashboard', subtitle: 'Real-time dashboard for monitoring campus infrastructure using IoT sensors.', type: 'Industry', company: 'TCS iON', year: '2024', status: 'completed', progress: 100, role: 'IoT + Frontend', techStack: 'React,MQTT,Node.js,InfluxDB,Grafana', userId: admin.id },
    { title: 'ChatBot for Student Support', subtitle: 'AI-powered chatbot using RAG to answer student queries from university knowledge base.', type: 'Personal', company: null, year: '2025', status: 'active', progress: 40, role: 'ML Engineer', techStack: 'Python,LangChain,ChromaDB,FastAPI,React', userId: admin.id },
  ]
  await prisma.project.createMany({ data: projects })
  console.log(`✅ ${projects.length} projects created`)

  // ── Programs ──
  const programs = [
    { title: 'Full Stack Web Development', type: 'Industrial Training', status: 'active', batch: 'Batch 2025-A', startDate: 'Jan 2025', endDate: 'Jun 2025', duration: '6 Months', progress: 70, mentor: 'Rajesh Kumar', skills: 'HTML,CSS,JavaScript,React,Node.js,MongoDB,Git', employer: 'FlippedLearn Pvt. Ltd.', userId: admin.id },
    { title: 'Data Science & Analytics', type: 'Internship', status: 'active', batch: 'Cohort 8', startDate: 'Feb 2025', endDate: 'Jul 2025', duration: '6 Months', progress: 50, mentor: 'Dr. Priya Sharma', skills: 'Python,Pandas,NumPy,Scikit-Learn,SQL,Tableau,Power BI', employer: 'IBM India', userId: admin.id },
    { title: 'Cloud Engineering with AWS', type: 'Apprenticeship', status: 'active', batch: 'Cloud-2025', startDate: 'Mar 2025', endDate: 'Aug 2025', duration: '6 Months', progress: 35, mentor: 'Suresh Babu', skills: 'AWS,EC2,S3,Lambda,CloudFormation,Terraform,Docker', employer: 'Amazon Web Services', userId: admin.id },
    { title: 'Android App Development', type: 'Industrial Training', status: 'completed', batch: 'Batch 2024-B', startDate: 'Jul 2024', endDate: 'Dec 2024', duration: '6 Months', progress: 100, mentor: 'Vikram Singh', skills: 'Kotlin,Jetpack Compose,Firebase,Room DB,REST APIs', employer: 'Zoho Corporation', userId: admin.id },
    { title: 'Cybersecurity Fundamentals', type: 'Internship', status: 'completed', batch: 'SecOps-24', startDate: 'Aug 2024', endDate: 'Nov 2024', duration: '4 Months', progress: 100, mentor: 'Anita Desai', skills: 'Networking,Linux,Penetration Testing,SIEM,Wireshark', employer: 'Infosys BPM', userId: admin.id },
  ]
  await prisma.program.createMany({ data: programs })
  console.log(`✅ ${programs.length} programs created`)

  // ── Logbook Entries ──
  const logbookEntries = [
    { date: '25 Mar 2025', time: '09:00 - 17:00', activity: 'Frontend Development – Built responsive dashboard components', hours: 8, supervisor: 'Rajesh Kumar', tasks: 5, status: 'Completed', userId: admin.id },
    { date: '24 Mar 2025', time: '09:00 - 17:30', activity: 'API Integration – Connected frontend with REST APIs using Axios', hours: 8, supervisor: 'Rajesh Kumar', tasks: 4, status: 'Completed', userId: admin.id },
    { date: '22 Mar 2025', time: '09:00 - 18:00', activity: 'Database Design – Created Prisma schema and ran migrations', hours: 9, supervisor: 'Dr. Priya Sharma', tasks: 6, status: 'Completed', userId: admin.id },
    { date: '21 Mar 2025', time: '10:00 - 17:00', activity: 'Code Review – Reviewed PRs and fixed bug reports', hours: 7, supervisor: 'Rajesh Kumar', tasks: 8, status: 'Completed', userId: admin.id },
    { date: '20 Mar 2025', time: '09:00 - 17:00', activity: 'Authentication – Implemented JWT-based login and session management', hours: 8, supervisor: 'Rajesh Kumar', tasks: 3, status: 'Completed', userId: admin.id },
    { date: '19 Mar 2025', time: '09:30 - 16:30', activity: 'Testing – Wrote unit tests for API endpoints using Jest', hours: 7, supervisor: 'Suresh Babu', tasks: 4, status: 'Completed', userId: admin.id },
    { date: '18 Mar 2025', time: '09:00 - 17:00', activity: 'Deployment – Set up Docker containers and CI/CD pipeline', hours: 8, supervisor: 'Suresh Babu', tasks: 3, status: 'Completed', userId: admin.id },
    { date: '26 Mar 2025', time: '09:00 - 17:00', activity: 'UI Polish – Accessibility audit and contrast fixes', hours: 8, supervisor: 'Rajesh Kumar', tasks: 6, status: 'Pending', userId: admin.id },
    { date: '27 Mar 2025', time: '09:00 - 17:00', activity: 'Documentation – Writing API docs and user guide', hours: 8, supervisor: 'Rajesh Kumar', tasks: 3, status: 'Pending', userId: admin.id },
  ]
  await prisma.logbookEntry.createMany({ data: logbookEntries })
  console.log(`✅ ${logbookEntries.length} logbook entries created`)

  // ── Certificates ──
  const certificates = [
    { title: 'Meta Front-End Developer', category: 'programs', catLabel: 'Program', date: 'Dec 2024', issuer: 'Meta (via Coursera)', icon: 'fab fa-react', credId: 'META-FE-2024-8842', progress: 100, status: 'earned', userId: admin.id },
    { title: 'CS50 – Introduction to Computer Science', category: 'courses', catLabel: 'Course', date: 'Oct 2024', issuer: 'Harvard University (via edX)', icon: 'fas fa-graduation-cap', credId: 'HRV-CS50-2024-1123', progress: 100, status: 'earned', userId: admin.id },
    { title: 'Machine Learning A-Z', category: 'courses', catLabel: 'Course', date: 'Feb 2025', issuer: 'Udemy', icon: 'fas fa-brain', credId: 'UDEM-ML-2025-5567', progress: 100, status: 'earned', userId: admin.id },
    { title: 'AWS Cloud Practitioner', category: 'skills', catLabel: 'Skill', date: 'Expected Aug 2025', issuer: 'Amazon Web Services', icon: 'fab fa-aws', credId: null, progress: 35, status: 'progress', userId: admin.id },
    { title: 'Full Stack Web Development', category: 'programs', catLabel: 'Program', date: 'Expected Jun 2025', issuer: 'FlippedLearn', icon: 'fas fa-layer-group', credId: null, progress: 70, status: 'progress', userId: admin.id },
    { title: 'IBM Data Science Professional', category: 'programs', catLabel: 'Program', date: 'Expected Jul 2025', issuer: 'IBM (via Coursera)', icon: 'fas fa-chart-line', credId: null, progress: 30, status: 'progress', userId: admin.id },
    { title: 'Python for Everybody', category: 'courses', catLabel: 'Course', date: 'Sep 2024', issuer: 'University of Michigan (via Coursera)', icon: 'fab fa-python', credId: 'UMICH-PY-2024-3319', progress: 100, status: 'earned', userId: admin.id },
  ]
  await prisma.certificate.createMany({ data: certificates })
  console.log(`✅ ${certificates.length} certificates created`)

  // ── Notifications ──
  const notifications = [
    { title: 'New Assignment Posted', message: 'A new assignment "CI/CD Pipeline Setup with GitHub Actions" has been posted for DevOps Fundamentals. Due date: 25 May 2025.', type: 'system', unread: true, userId: admin.id },
    { title: 'Assessment Graded', message: 'Your "React Component Architecture" assessment has been graded. You scored 76/100. Check the Assessment page for details.', type: 'system', unread: true, userId: admin.id },
    { title: 'Placement Drive – TCS', message: 'TCS is conducting an on-campus placement drive on 15 Apr 2025. Eligible branches: CSE, IT, ECE. Register on the Placement Portal before 10 Apr.', type: 'placement', unread: true, userId: admin.id },
    { title: 'Course Completed! 🎉', message: 'Congratulations! You have completed "Machine Learning A-Z: AI & Python". Your certificate is now available in the Certificates section.', type: 'system', unread: false, userId: admin.id },
    { title: 'Placement Drive – Infosys', message: 'Infosys InfyTQ hiring for 2025 batch. Online test scheduled for 20 Apr 2025. Refer to the Placement Portal for preparation resources.', type: 'placement', unread: true, userId: admin.id },
    { title: 'Mentor Feedback Received', message: 'Your mentor Rajesh Kumar has reviewed your Week 12 logbook entries. Overall rating: Excellent. Check logbook for comments.', type: 'user', unread: false, userId: admin.id },
    { title: 'System Maintenance', message: 'Learner360° will undergo scheduled maintenance on 30 Mar 2025, 2:00 AM – 5:00 AM IST. Some features may be temporarily unavailable.', type: 'system', unread: false },
  ]
  await prisma.notification.createMany({ data: notifications })
  console.log(`✅ ${notifications.length} notifications created`)

  // ── Support Tickets ──
  const supportTickets = [
    { ticketId: '#TKT-0001', subject: 'Unable to submit assignment – file upload error', description: 'When I try to upload a .zip file for the "E-Commerce REST API" assignment, I get a 413 error. The file is only 8 MB.', category: 'Technical Issue', status: 'In Progress', userId: admin.id },
    { ticketId: '#TKT-0002', subject: 'Certificate not generated after course completion', description: 'I completed the CS50 course but the certificate is showing as "In Progress" instead of "Earned". My progress shows 100%.', category: 'Content Question', status: 'Resolved', userId: admin.id },
    { ticketId: '#TKT-0003', subject: 'Request to change batch from 2025-A to 2025-B', description: 'Due to personal reasons, I need to switch my Full Stack Development batch from 2025-A (Jan start) to 2025-B (Apr start).', category: 'Account Problem', status: 'In Progress', userId: admin.id },
  ]
  await prisma.supportTicket.createMany({ data: supportTickets })
  console.log(`✅ ${supportTickets.length} support tickets created`)

  // ── Job Listings ──
  const jobListings = [
    { company: 'Tata Consultancy Services', role: 'Systems Engineer', location: 'Hyderabad', salary: '₹3.6 – 7 LPA', status: 'Applied' },
    { company: 'Infosys', role: 'Software Engineer', location: 'Bangalore', salary: '₹3.6 – 6.5 LPA', status: 'Applied' },
    { company: 'Wipro', role: 'Project Engineer', location: 'Chennai', salary: '₹3.5 – 5 LPA', status: 'Not Applied' },
    { company: 'HCLTech', role: 'Graduate Engineer Trainee', location: 'Noida', salary: '₹4.25 – 6 LPA', status: 'Not Applied' },
    { company: 'Cognizant', role: 'Programmer Analyst Trainee', location: 'Pune', salary: '₹4 – 6.75 LPA', status: 'Applied' },
    { company: 'Accenture', role: 'Associate Software Engineer', location: 'Mumbai', salary: '₹4.5 – 8 LPA', status: 'Selected' },
    { company: 'Capgemini', role: 'Analyst – A1', location: 'Hyderabad', salary: '₹3.8 – 6 LPA', status: 'Not Applied' },
    { company: 'Tech Mahindra', role: 'Associate Engineer', location: 'Pune', salary: '₹3.25 – 5.5 LPA', status: 'Not Applied' },
    { company: 'Zoho Corporation', role: 'Member Technical Staff', location: 'Chennai', salary: '₹6 – 10 LPA', status: 'Applied' },
    { company: 'Amazon (SDE Intern)', role: 'Software Dev Engineer Intern', location: 'Bangalore', salary: '₹12 – 20 LPA', status: 'Not Applied' },
    { company: 'Google (STEP Intern)', role: 'Student Training in Engineering', location: 'Hyderabad', salary: '₹15 – 25 LPA', status: 'Not Applied' },
    { company: 'Microsoft', role: 'Software Engineer – Fresher', location: 'Hyderabad', salary: '₹18 – 28 LPA', status: 'Not Applied' },
  ]
  await prisma.jobListing.createMany({ data: jobListings })
  console.log(`✅ ${jobListings.length} job listings created`)

  console.log('\n🎉 Database seeding complete!')
  console.log('─────────────────────────────')
  console.log(`  Users:         2`)
  console.log(`  Courses:       ${courses.length}`)
  console.log(`  Assessments:   ${assessments.length}`)
  console.log(`  Assignments:   ${assignments.length}`)
  console.log(`  Projects:      ${projects.length}`)
  console.log(`  Programs:      ${programs.length}`)
  console.log(`  Logbook:       ${logbookEntries.length}`)
  console.log(`  Certificates:  ${certificates.length}`)
  console.log(`  Notifications: ${notifications.length}`)
  console.log(`  Tickets:       ${supportTickets.length}`)
  console.log(`  Job Listings:  ${jobListings.length}`)
  console.log('─────────────────────────────')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
