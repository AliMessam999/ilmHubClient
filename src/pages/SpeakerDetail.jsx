import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SpeakerDetail = () => {
  const { id } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeaker = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/speakers/${id}`);
        setSpeaker(res.data);
        
        // Extract unique topics from speaker's lectures
        const allTopics = res.data.lectures.flatMap(l => l.topics || []);
        const uniqueTopics = Array.from(new Map(allTopics.map(t => [t.id, t])).values());
        setTopics(uniqueTopics);
      } catch (error) {
        console.error('Error fetching speaker:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpeaker();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Speaker not found.</h2>
        <Link to="/lectures" className="text-primary hover:underline mt-4 inline-block">Back to lectures</Link>
      </div>
    );
  }

  return (
    <div className="pattern-bg min-h-screen">
      {/* Speaker Header */}
      <div className="bg-primary text-white border-b-4 border-secondary pt-12 pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/lectures" className="text-secondary hover:text-white mb-8 inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Lectures
          </Link>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-40 h-40 bg-white rounded-full border-4 border-secondary shadow-xl flex items-center justify-center flex-shrink-0 z-10 relative mt-4 md:mt-0 overflow-hidden">
              {speaker.image ? (
                <img src={`http://localhost:5000${speaker.image}`} alt={speaker.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-bold text-primary">{speaker.name.charAt(0)}</span>
              )}
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{speaker.name}</h1>
              <p className="text-gray-300 max-w-3xl text-lg leading-relaxed mb-6 whitespace-pre-line">{speaker.bio || 'No biography available for this speaker.'}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="bg-primary/50 px-4 py-2 rounded-lg border border-white/20 shadow-inner flex items-center gap-2">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  <span className="font-bold">{speaker.lectures?.length || 0} Lectures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 sticky top-24">
              <h3 className="text-xl font-bold text-primary mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Topics Covered
              </h3>
              {topics.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topics.map(topic => (
                    <Link key={topic.id} to={`/lectures?speakerId=${speaker.id}&topicId=${topic.id}`} className="text-sm bg-gray-100 text-gray-700 hover:bg-primary hover:text-white px-3 py-1.5 rounded-full transition-colors">
                      {topic.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No topics assigned to lectures yet.</p>
              )}
            </div>
          </div>

          {/* Lectures List */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                All Lectures by {speaker.name}
              </h2>

              {speaker.lectures?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {speaker.lectures.map((lecture) => {
                    let videoId = '';
                    if (lecture.videoUrl && lecture.videoUrl.includes('youtube.com/watch?v=')) {
                      videoId = new URLSearchParams(new URL(lecture.videoUrl).search).get('v') || '';
                    }
                    return (
                      <div key={lecture.id} className="bg-white rounded-lg shadow-sm hover:shadow-md overflow-hidden border border-gray-200 flex flex-col group transition-all">
                        <div className="relative pb-[56.25%] bg-gray-100">
                          {videoId && (
                            <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={lecture.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                            <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                          </div>
                          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow">
                            {lecture.language}
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            <Link to={`/lectures/${lecture.id}`}>{lecture.title}</Link>
                          </h3>
                          <div className="mt-auto flex flex-wrap gap-1">
                            {lecture.topics?.slice(0, 2).map((topic) => (
                              <span key={topic.id} className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded">{topic.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  <p>No lectures uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDetail;
