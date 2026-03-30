import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, TrendingUp, Calendar, MessageSquare, LogOut, User, ArrowLeft, Clock, CheckCircle, Send, Check, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

export default function ParentPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tutors' | 'progress' | 'messages'>('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ROOM_ID = 'parent_tutor_room_1'; // Mock room ID

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io();

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_room', ROOM_ID);
    });

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('user_typing', (data) => {
      setIsTyping(true);
      setTypingUser(data.senderName);
    });

    socketRef.current.on('user_stop_typing', () => {
      setIsTyping(false);
      setTypingUser('');
    });

    socketRef.current.on('message_read', (data) => {
      setMessages((prev) => 
        prev.map(m => m.id === data.messageId ? { ...m, isRead: true } : m)
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [bookingsRes, progressRes, messagesRes] = await Promise.all([
          fetch('/api/portal/bookings'),
          fetch('/api/portal/progress'),
          fetch('/api/portal/messages')
        ]);
        
        setBookings(await bookingsRes.json());
        setProgress(await progressRes.json());
        setMessages(await messagesRes.json());
      } catch (error) {
        console.error("Error fetching portal data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (activeTab === 'messages') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  useEffect(() => {
    if (activeTab === 'messages') {
      // Mark all unread messages from others as read
      const unreadMessages = messages.filter(m => !m.isRead && m.senderId !== 'parent');
      if (unreadMessages.length > 0) {
        setMessages(prev => prev.map(m => m.senderId !== 'parent' ? { ...m, isRead: true } : m));
        unreadMessages.forEach(m => {
          socketRef.current?.emit('mark_read', { room: ROOM_ID, messageId: m.id });
        });
      }
    }
  }, [activeTab, messages.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      senderId: 'parent',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Emit message to socket
    socketRef.current?.emit('send_message', {
      room: ROOM_ID,
      message: newMsg
    });

    // Stop typing
    socketRef.current?.emit('stop_typing', { room: ROOM_ID });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Emit typing event
    socketRef.current?.emit('typing', {
      room: ROOM_ID,
      senderName: 'Parent'
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('stop_typing', { room: ROOM_ID });
    }, 2000);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div></div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Active Tutors</p>
                  <h3 className="text-3xl font-bold text-slate-800">{bookings.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Upcoming Sessions</p>
                  <h3 className="text-3xl font-bold text-slate-800">{bookings.filter(b => b.nextSession).length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Unread Messages</p>
                  <h3 className="text-3xl font-bold text-slate-800">{messages.filter(m => !m.isRead && m.senderId !== 'parent').length}</h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Upcoming Sessions</h3>
                {bookings.length === 0 ? (
                  <p className="text-slate-500 text-sm">No upcoming sessions.</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(booking => (
                      <div key={booking.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-800">{booking.subject} with {booking.tutorName}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                            <Clock size={14} /> {new Date(booking.nextSession).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Confirmed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Recent Progress</h3>
                {progress.length === 0 ? (
                  <p className="text-slate-500 text-sm">No progress reports yet.</p>
                ) : (
                  <div className="space-y-3">
                    {progress.slice(0, 3).map(report => (
                      <div key={report.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-slate-800">{report.topic}</p>
                          <span className="font-bold text-brand-primary">{report.score}</span>
                        </div>
                        <p className="text-sm text-slate-600">{report.notes}</p>
                        <p className="text-xs text-slate-400 mt-2">{new Date(report.date).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'tutors':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">My Tutors & Bookings</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map(booking => (
                <div key={booking.id} className="border border-slate-200 rounded-xl p-5 hover:border-brand-primary/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-lg">
                        {booking.tutorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{booking.tutorName}</h4>
                        <p className="text-sm text-brand-primary font-medium">{booking.subject}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md">
                      {booking.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <p className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> {booking.schedule}</p>
                    <p className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> Next: {new Date(booking.nextSession).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveTab('messages')} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                      Message
                    </button>
                    <button className="flex-1 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'progress':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Progress Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Topic</th>
                    <th className="px-6 py-3 font-medium">Score/Grade</th>
                    <th className="px-6 py-3 font-medium">Tutor Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {progress.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No progress reports yet</td></tr>
                  ) : progress.map(report => (
                    <tr key={report.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{report.topic}</td>
                      <td className="px-6 py-4 font-bold text-brand-primary">{report.score}</td>
                      <td className="px-6 py-4 text-slate-600 min-w-[250px]">{report.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Messages</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500 font-medium">Live Chat</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {messages.map(msg => {
                const isMe = msg.senderId === 'parent';
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${isMe ? 'bg-brand-primary text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                      {!isMe && <p className="text-xs font-bold mb-1 text-slate-500">{msg.senderName}</p>}
                      <p className="text-sm">{msg.text}</p>
                      <div className={`flex items-center gap-1 mt-2 justify-end ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        <p className="text-[10px]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isMe && (
                          msg.isRead ? <CheckCheck size={12} className="text-white" /> : <Check size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-3 text-sm flex items-center gap-2">
                    <span className="font-medium text-xs">{typingUser} is typing</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-100 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type your message..." 
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:bg-brand-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-6">
            <ArrowLeft size={16} /> Back to Site
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Student Portal</p>
              <span className="font-bold text-slate-800">Welcome, Parent</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <BookOpen size={20} />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('tutors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'tutors' ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <User size={20} />
            <span>My Tutors</span>
          </button>
          <button 
            onClick={() => setActiveTab('progress')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'progress' ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <TrendingUp size={20} />
            <span>Progress Reports</span>
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'messages' ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare size={20} />
            <span>Messages</span>
            {messages.filter(m => !m.isRead && m.senderId !== 'parent').length > 0 && (
              <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {messages.filter(m => !m.isRead && m.senderId !== 'parent').length}
              </span>
            )}
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold font-display text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Portal Overview' : activeTab === 'tutors' ? 'My Tutors & Bookings' : activeTab}
            </h1>
            <p className="text-slate-500 mt-1">Manage your tutoring sessions and track progress.</p>
          </header>

          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}
