import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import http from "http";
import { Server } from "socket.io";

const mockTutors = [
  { id: '1', name: 'Rahim Uddin', subjects: ['Physics', 'Math'], classes: ['9', '10', 'HSC-1', 'HSC-2'], areas: ['Balubari', 'Mission Road'], rate: 4000, rating: 4.8, isAvailableNow: true },
  { id: '2', name: 'Karim Hasan', subjects: ['Chemistry', 'Biology', 'Medical Admission'], classes: ['HSC-1', 'HSC-2', 'Admission'], areas: ['Suihari', 'Balubari'], rate: 6000, rating: 4.9, isAvailableNow: false },
  { id: '3', name: 'Sadia Islam', subjects: ['English', 'Math'], classes: ['9', '10'], areas: ['Ghashipara', 'Paharpur'], rate: 3000, rating: 4.7, isAvailableNow: true },
  { id: '4', name: 'Tanvir Ahmed', subjects: ['Physics', 'Chemistry', 'Math'], classes: ['HSC-1', 'HSC-2', 'Admission'], areas: ['Mission Road', 'Kalitola'], rate: 8000, rating: 5.0, isAvailableNow: true },
  { id: '5', name: 'Nusrat Jahan', subjects: ['Biology', 'Science'], classes: ['9', '10'], areas: ['Balubari', 'Suihari'], rate: 3500, rating: 4.6, isAvailableNow: true },
  { id: '6', name: 'Fahim Rahman', subjects: ['Math', 'Higher Math'], classes: ['9', '10', 'HSC-1', 'HSC-2'], areas: ['Mission Road', 'Suihari'], rate: 5000, rating: 4.5, isAvailableNow: true },
];

let leads: any[] = [];
let applications: any[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  app.use(express.json());

  // Mock API for Lead Logging & Tutor Matching
  app.post("/api/leads", (req, res) => {
    const lead = req.body;
    console.log("New Lead Received:", lead);

    const newLead = { 
      id: Date.now().toString(), 
      ...lead, 
      status: 'New', 
      createdAt: new Date().toISOString() 
    };
    leads.push(newLead);

    const budget = parseInt(lead.budget) || 0;
    const subjectQuery = (lead.subject || "").toLowerCase();

    // Matching Algorithm
    let scoredTutors = mockTutors.map(tutor => {
      let score = 0;
      let isSubjectMatch = tutor.subjects.some(s => s.toLowerCase().includes(subjectQuery) || subjectQuery.includes(s.toLowerCase()));
      let isClassMatch = tutor.classes.includes(lead.studentClass);

      // Base filtering: Must have some relevance
      if (!isSubjectMatch && !isClassMatch) return { ...tutor, score: -1 };

      // Scoring factors
      if (isSubjectMatch) score += 25;
      if (isClassMatch) score += 20;
      if (tutor.areas.includes(lead.area)) score += 20;
      if (tutor.rate <= budget) score += 15;
      
      // Rating weight
      score += (tutor.rating * 4); // Max 20 points

      // Urgency toggle logic
      if (lead.urgency) {
        if (tutor.isAvailableNow) score += 25;
        else score -= 40; // Heavy penalty if urgent but tutor is not available
      } else {
        if (tutor.isAvailableNow) score += 10;
      }

      return { ...tutor, score };
    });

    // Filter and sort top matches
    let matchedTutors = scoredTutors
      .filter(t => t.score > 30) // Minimum threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Return top 3 matches

    res.status(201).json({ 
      success: true, 
      message: "Lead logged successfully", 
      data: newLead,
      matches: matchedTutors
    });
  });

  // Mock API for Tutor Applications
  app.post("/api/applications", (req, res) => {
    const appData = req.body;
    const newApp = { 
      id: Date.now().toString(), 
      ...appData, 
      status: 'Pending Review', 
      createdAt: new Date().toISOString() 
    };
    applications.push(newApp);
    res.status(201).json({ success: true, message: "Application received", data: newApp });
  });

  // Admin Dashboard Endpoints
  app.get("/api/tutors", (req, res) => res.json(mockTutors));
  app.get("/api/leads", (req, res) => res.json(leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())));
  app.get("/api/applications", (req, res) => res.json(applications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())));

  // Parent Portal Mock Data & Endpoints
  const mockBookings = [
    { id: 'b1', tutorId: '1', tutorName: 'Rahim Uddin', subject: 'Physics', schedule: 'Mon, Wed 4:00 PM', status: 'Active', nextSession: '2026-04-01T16:00:00Z' },
    { id: 'b2', tutorId: '3', tutorName: 'Sadia Islam', subject: 'English', schedule: 'Tue, Thu 5:00 PM', status: 'Active', nextSession: '2026-04-02T17:00:00Z' }
  ];
  const mockProgress = [
    { id: 'p1', bookingId: 'b1', date: '2026-03-25', topic: 'Kinematics', score: '85%', notes: 'Good understanding, needs practice on vector addition.' },
    { id: 'p2', bookingId: 'b2', date: '2026-03-28', topic: 'Grammar & Composition', score: '90%', notes: 'Excellent essay structure.' }
  ];
  const mockMessages = [
    { id: 'm1', senderId: '1', senderName: 'Rahim Uddin', text: 'Hi, please make sure to complete the worksheet before our next class.', timestamp: '2026-03-29T10:00:00Z', isRead: false },
    { id: 'm2', senderId: 'parent', senderName: 'You', text: 'Will do, thanks!', timestamp: '2026-03-29T10:05:00Z', isRead: true }
  ];

  app.get("/api/portal/bookings", (req, res) => res.json(mockBookings));
  app.get("/api/portal/progress", (req, res) => res.json(mockProgress));
  app.get("/api/portal/messages", (req, res) => res.json(mockMessages));

  // Socket.io real-time chat logic
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('send_message', (data) => {
      mockMessages.push(data.message);
      socket.to(data.room).emit('receive_message', data.message);
    });

    socket.on('typing', (data) => {
      socket.to(data.room).emit('user_typing', data);
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.room).emit('user_stop_typing', data);
    });

    socket.on('mark_read', (data) => {
      const msg = mockMessages.find(m => m.id === data.messageId);
      if (msg) msg.isRead = true;
      socket.to(data.room).emit('message_read', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
