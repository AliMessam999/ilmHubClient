import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LectureDetail = () => {
  const { id } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedLectures, setRelatedLectures] = useState([]);

  useEffect(() => {
    const fetchLecture = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/lectures/${id}`);
        setLecture(res.data);
        
        // Fetch related lectures (same speaker or topics)
        const relatedRes = await axios.get(`http://localhost:5000/api/lectures?speakerId=${res.data.speakerId}&limit=5`);
        setRelatedLectures(relatedRes.data.filter(l => l.id !== parseInt(id)));
      } catch (error) {
        console.error('Error fetching lecture:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecture();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Lecture not found.</h2>
        <Link to="/lectures" className="text-primary hover:underline mt-4 inline-block">Back to lectures</Link>
      </div>
    );
  }

  // YouTube Embed Logic
  let embedUrl = '';
  if (lecture.videoUrl) {
    if (lecture.videoUrl.includes('youtube.com/watch?v=')) {
      const videoId = new URLSearchParams(new URL(lecture.videoUrl).search).get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (lecture.videoUrl.includes('youtu.be/')) {
      const videoId = lecture.videoUrl.split('/').pop();
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <div className="pattern-bg min-h-screen">
      <div className="bg-primary text-white border-b-4 border-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link to="/lectures" className="text-secondary hover:text-white mb-6 inline-flex items-center gap-2 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Lectures
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{lecture.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <Link to={`/speakers/${lecture.speakerId}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className="font-medium text-white">{lecture.speaker?.name}</span>
            </Link>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {lecture.date ? new Date(lecture.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown Date'}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              {lecture.language}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 border border-gray-100">
          {/* Video Player */}
          <div className="relative pb-[56.25%] bg-black">
            {embedUrl ? (
              <iframe 
                src={embedUrl} 
                className="absolute top-0 left-0 w-full h-full" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                <p>No video available for this lecture.</p>
              </div>
            )}
          </div>

          {/* Lecture Info */}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {lecture.topics?.map((topic) => (
                <Link key={topic.id} to={`/lectures?topicId=${topic.id}`} className="bg-primary/10 text-primary hover:bg-primary hover:text-white text-sm font-bold px-3 py-1 rounded transition-colors">
                  {topic.name}
                </Link>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Description</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {lecture.description || <span className="italic text-gray-500">No description provided for this lecture.</span>}
            </div>
          </div>
        </div>

        {/* Related Lectures */}
        {relatedLectures.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Related Lectures
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedLectures.map((related) => {
                let rVideoId = '';
                if (related.videoUrl && related.videoUrl.includes('youtube.com/watch?v=')) {
                  rVideoId = new URLSearchParams(new URL(related.videoUrl).search).get('v') || '';
                }
                return (
                  <div key={related.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col group">
                    <div className="relative pb-[56.25%] bg-gray-200">
                      {rVideoId && (
                        <img src={`https://img.youtube.com/vi/${rVideoId}/mqdefault.jpg`} alt={related.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm group-hover:text-primary transition-colors">
                        <Link to={`/lectures/${related.id}`}>{related.title}</Link>
                      </h4>
                      <p className="text-xs text-gray-500 mt-auto">{related.speaker?.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureDetail;
