import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { AuthContext } from '../context/AuthContext';

const EMPTY_SPEAKER  = { name: '', bio: '' };
const EMPTY_TOPIC    = { name: '' };
const EMPTY_LECTURE  = { title: '', description: '', videoUrl: '', language: 'English', date: '', speakerId: '', topicIds: [] };

const AdminDashboard = () => {
  const [speakers, setSpeakers]   = useState([]);
  const [topics, setTopics]       = useState([]);
  const [lectures, setLectures]   = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading]     = useState(false);

  // Form states
  const [newSpeaker, setNewSpeaker]     = useState(EMPTY_SPEAKER);
  const [speakerImage, setSpeakerImage] = useState(null);
  const [newTopic, setNewTopic]         = useState(EMPTY_TOPIC);
  const [newLecture, setNewLecture]     = useState(EMPTY_LECTURE);

  // Edit mode: null = creating, otherwise the id being edited
  const [editingId, setEditingId] = useState(null);

  const getToken  = () => localStorage.getItem('token');
  const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Auth guard — redirect to login if logged out from anywhere
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, t, l] = await Promise.all([
        axios.get('http://localhost:5000/api/speakers'),
        axios.get('http://localhost:5000/api/topics'),
        axios.get('http://localhost:5000/api/lectures'),
      ]);
      setSpeakers(s.data);
      setTopics(t.data);
      setLectures(l.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────── EDIT HELPERS ───────────────── */
  const startEdit = (item) => {
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (activeTab === 'speakers') {
      setNewSpeaker({ name: item.name || '', bio: item.bio || '' });
      setSpeakerImage(null);
    } else if (activeTab === 'topics') {
      setNewTopic({ name: item.name || '' });
    } else if (activeTab === 'lectures') {
      setNewLecture({
        title: item.title || '',
        description: item.description || '',
        videoUrl: item.videoUrl || '',
        language: item.language || 'English',
        date: item.date ? item.date.substring(0, 10) : '',
        speakerId: item.speakerId ? String(item.speakerId) : '',
        topicIds: item.topics ? item.topics.map(t => t.id) : [],
      });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewSpeaker(EMPTY_SPEAKER);
    setSpeakerImage(null);
    setNewTopic(EMPTY_TOPIC);
    setNewLecture(EMPTY_LECTURE);
  };

  /* ───────────────── SUBMIT HANDLERS ───────────────── */
  const handleSpeakerSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) { alert('Not logged in! Please sign in with admin@ilmhub.com'); return; }

    const formData = new FormData();
    formData.append('name', newSpeaker.name);
    formData.append('bio', newSpeaker.bio);
    if (speakerImage) formData.append('image', speakerImage);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/speakers/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/speakers', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/topics/${editingId}`, newTopic, getConfig());
      } else {
        await axios.post('http://localhost:5000/api/topics', newTopic, getConfig());
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/lectures/${editingId}`, newLecture, getConfig());
      } else {
        await axios.post('http://localhost:5000/api/lectures', newLecture, getConfig());
      }
      cancelEdit();
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/${type}/${id}`, getConfig());
      if (editingId === id) cancelEdit();
      fetchData();
    } catch (err) {
      alert(`Error deleting: ` + (err.response?.data?.message || err.message));
    }
  };

  /* ───────────────── UI HELPERS ───────────────── */
  const inputCls  = 'w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-[#0B4A2B] outline-none transition';
  const btnPrimary = `w-full bg-[#0B4A2B] text-white font-bold py-3 rounded-lg hover:bg-[#06301c] transition-all`;

  /* ───────────────── DASHBOARD ───────────────── */
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Speakers', count: speakers.length, color: 'blue',   icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
          { label: 'Total Topics',   count: topics.length,   color: 'purple', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
          { label: 'Total Lectures', count: lectures.length, color: 'green',  icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        ].map(({ label, count, color, icon }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Recently Added Lectures</h3>
          <button onClick={() => setActiveTab('lectures')} className="text-sm font-medium text-[#0B4A2B] hover:text-[#D4AF37]">View All</button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Speaker</th>
              <th className="px-6 py-4">Language</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {lectures.slice(0, 5).map(l => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{l.title}</td>
                <td className="px-6 py-4">{l.speaker?.name}</td>
                <td className="px-6 py-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{l.language}</span></td>
              </tr>
            ))}
            {lectures.length === 0 && (
              <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-400 italic">No lectures found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ───────────────── FORM ───────────────── */
  const renderForm = () => {
    if (activeTab === 'dashboard') return null;
    const isEditing = !!editingId;

    return (
      <div className={`bg-white p-4 md:p-8 rounded-xl shadow-sm border mb-6 md:mb-8 ${isEditing ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30' : 'border-gray-100'}`}>
        <div className="flex flex-wrap justify-between items-start gap-3 mb-6 border-b pb-4">
          <h2 className="text-lg md:text-2xl font-bold text-[#0B4A2B] capitalize">
            {isEditing ? `Edit ${activeTab.slice(0, -1)} #${editingId}` : `Add New ${activeTab.slice(0, -1)}`}
          </h2>
          {isEditing && (
            <button onClick={cancelEdit} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg transition flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              Cancel
            </button>
          )}
        </div>

        {/* SPEAKERS FORM */}
        {activeTab === 'speakers' && (
          <form onSubmit={handleSpeakerSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input type="text" className={inputCls} value={newSpeaker.name} onChange={e => setNewSpeaker({...newSpeaker, name: e.target.value})} required placeholder="e.g. Mufti Menk" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Biography</label>
                <textarea className={`${inputCls} h-32`} value={newSpeaker.bio} onChange={e => setNewSpeaker({...newSpeaker, bio: e.target.value})} placeholder="Speaker bio..." />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Speaker Image {isEditing && <span className="text-gray-400 font-normal">(leave empty to keep current)</span>}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <label className="cursor-pointer text-sm font-medium text-[#0B4A2B] hover:text-[#D4AF37]">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" onChange={e => setSpeakerImage(e.target.files[0])} />
                    </label>
                    <p className="text-xs text-gray-500">{speakerImage ? speakerImage.name : 'PNG, JPG up to 10MB'}</p>
                  </div>
                </div>
              </div>
              <button type="submit" className={btnPrimary}>
                {isEditing ? '✏️ Update Speaker' : '+ Save Speaker'}
              </button>
            </div>
          </form>
        )}

        {/* TOPICS FORM */}
        {activeTab === 'topics' && (
          <form onSubmit={handleTopicSubmit} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Topic Title</label>
              <input type="text" className={inputCls} value={newTopic.name} onChange={e => setNewTopic({...newTopic, name: e.target.value})} required placeholder="e.g. Spirituality" />
            </div>
            <button type="submit" className={btnPrimary}>
              {isEditing ? '✏️ Update Topic' : '+ Add Topic'}
            </button>
          </form>
        )}

        {/* LECTURES FORM */}
        {activeTab === 'lectures' && (
          <form onSubmit={handleLectureSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lecture Title</label>
                <input type="text" className={inputCls} value={newLecture.title} onChange={e => setNewLecture({...newLecture, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea className={`${inputCls} h-24`} value={newLecture.description} onChange={e => setNewLecture({...newLecture, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Speaker</label>
                <select className={inputCls} value={newLecture.speakerId} onChange={e => setNewLecture({...newLecture, speakerId: e.target.value})} required>
                  <option value="">-- Choose Speaker --</option>
                  {speakers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Video URL (YouTube)</label>
                <input type="url" className={inputCls} value={newLecture.videoUrl} onChange={e => setNewLecture({...newLecture, videoUrl: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Language</label>
                  <select className={inputCls} value={newLecture.language} onChange={e => setNewLecture({...newLecture, language: e.target.value})}>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Arabic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                  <input type="date" className={inputCls} value={newLecture.date} onChange={e => setNewLecture({...newLecture, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Topics</label>
                <div className="max-h-36 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50 grid grid-cols-2 gap-2">
                  {topics.map(t => (
                    <label key={t.id} className="flex items-center text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLecture.topicIds.includes(t.id)}
                        onChange={(e) => {
                          const ids = [...newLecture.topicIds];
                          if (e.target.checked) ids.push(t.id);
                          else ids.splice(ids.indexOf(t.id), 1);
                          setNewLecture({...newLecture, topicIds: ids});
                        }}
                        className="mr-2 h-4 w-4 text-[#0B4A2B] rounded"
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={`${btnPrimary} py-4`}>
                {isEditing ? '✏️ Update Lecture' : '+ Create Lecture'}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  /* ───────────────── TABLE ───────────────── */
  const renderTable = () => {
    if (activeTab === 'dashboard') return null;
    const items = activeTab === 'speakers' ? speakers : activeTab === 'topics' ? topics : lectures;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b font-bold text-[#0B4A2B] text-sm md:text-base">
          Existing {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({items.length})
        </div>
        {/* horizontal scroll wrapper for mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-white border-b">
              <tr className="text-xs font-bold text-gray-500 uppercase">
                <th className="px-4 md:px-6 py-3 md:py-4 w-12">ID</th>
                <th className="px-4 md:px-6 py-3 md:py-4">Title / Name</th>
                {activeTab === 'lectures' && <th className="px-4 md:px-6 py-3 md:py-4">Speaker</th>}
                {activeTab === 'speakers' && <th className="px-4 md:px-6 py-3 md:py-4">Lectures</th>}
                <th className="px-4 md:px-6 py-3 md:py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${editingId === item.id ? 'bg-yellow-50 border-l-4 border-[#D4AF37]' : ''}`}>
                  <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-500">{item.id}</td>
                  <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-gray-800 max-w-[180px] md:max-w-none truncate">{item.name || item.title}</td>
                  {activeTab === 'lectures' && <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600 whitespace-nowrap">{item.speaker?.name}</td>}
                  {activeTab === 'speakers' && <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-600 whitespace-nowrap">{item._count?.lectures ?? '—'} lectures</td>}
                  <td className="px-4 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-[#0B4A2B] hover:text-white font-bold text-xs bg-green-50 hover:bg-[#0B4A2B] px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-green-200 transition-all mr-1"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteItem(activeTab, item.id)}
                      className="text-red-600 hover:text-white font-bold text-xs bg-red-50 hover:bg-red-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-red-200 transition-all"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 md:p-10 text-center text-gray-400 italic">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ───────────────── RENDER ───────────────── */
  return (
    <AdminLayout
      title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      activeTab={activeTab}
      setActiveTab={(tab) => { cancelEdit(); setActiveTab(tab); }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B4A2B]"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' ? renderDashboard() : (
            <>
              {renderForm()}
              {renderTable()}
            </>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
