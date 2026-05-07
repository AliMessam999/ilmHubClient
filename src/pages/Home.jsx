import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  const [featuredSpeakers, setFeaturedSpeakers] = useState([]);
  const [latestLectures, setLatestLectures] = useState([]);
  const [popularTopics, setPopularTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, lecturesRes, topicsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/speakers?sort=popular&limit=12'),
          axios.get('http://localhost:5000/api/lectures?limit=6'),
          axios.get('http://localhost:5000/api/topics?sort=popular&limit=5')
        ]);
        setFeaturedSpeakers(speakersRes.data);
        setLatestLectures(lecturesRes.data);
        setPopularTopics(topicsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M50 20 L80 50 L50 80 L20 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Discover Authentic <span className="text-secondary">Islamic Knowledge</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light">
            Browse and watch educational lectures from renowned scholars. Filter by topic, language, and speaker to find exactly what you're looking for.
          </p>
          <Link to="/lectures" className="inline-block bg-secondary text-primary font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:-translate-y-1">
            Start Exploring
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Speakers */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Featured Speakers
            </h2>
            <div className="flex gap-2">
              <button className="speaker-prev bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white p-2 rounded-full shadow-sm transition-all outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <button className="speaker-next bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white p-2 rounded-full shadow-sm transition-all outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.speaker-next',
              prevEl: '.speaker-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            loop={featuredSpeakers.length > 4}
            className="speaker-slider"
          >
            {featuredSpeakers.map((speaker) => (
              <SwiperSlide key={speaker.id}>
                <Link to={`/speakers/${speaker.id}`} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all block border border-gray-100 h-full">
                  <div className="h-32 bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors overflow-hidden">
                    {speaker.image ? (
                      <img src={`http://localhost:5000${speaker.image}`} alt={speaker.name} className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-primary/20 group-hover:border-primary transition-colors" />
                    ) : (
                      <div className="w-24 h-24 bg-primary text-secondary rounded-full flex items-center justify-center text-3xl font-bold shadow-md border-2 border-primary/20 group-hover:border-primary transition-colors">
                        {speaker.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">{speaker.name}</h3>
                    <p className="text-sm text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full">{speaker._count?.lectures || 0} Lectures</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Latest Lectures */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Latest Lectures
            </h2>
            <Link to="/lectures" className="text-primary font-semibold hover:text-secondary transition-colors">View All &rarr;</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestLectures.map((lecture) => {
              let videoId = '';
              if (lecture.videoUrl && lecture.videoUrl.includes('youtube.com/watch?v=')) {
                videoId = new URLSearchParams(new URL(lecture.videoUrl).search).get('v') || '';
              }
              return (
                <div key={lecture.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col">
                  <div className="relative pb-[56.25%] bg-gray-200">
                    {videoId ? (
                      <>
                        <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={lecture.title} className="absolute top-0 left-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <svg className="w-16 h-16 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>
                        </div>
                      </>
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {lecture.language}
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {lecture.topics?.slice(0, 2).map((topic) => (
                        <span key={topic.id} className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{topic.name}</span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      <Link to={`/lectures/${lecture.id}`} className="hover:text-primary transition-colors">{lecture.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">{lecture.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link to={`/speakers/${lecture.speakerId}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-primary font-bold">
                          {lecture.speaker?.name?.charAt(0)}
                        </div>
                        {lecture.speaker?.name}
                      </Link>
                      <span className="text-xs text-gray-500">{lecture.date ? new Date(lecture.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Topics */}
        <div>
          <div className="flex justify-between items-end mb-8 border-b-2 border-gray-200 pb-4">
            <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
              Popular Topics
            </h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {popularTopics.map((topic) => (
              <Link 
                key={topic.id} 
                to={`/lectures?topicId=${topic.id}`} 
                className="bg-white border border-gray-200 hover:border-secondary hover:bg-secondary/5 text-gray-800 font-medium px-6 py-3 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                {topic.name}
                <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full">{topic._count?.lectures || 0}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
