import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Lectures = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lectures, setLectures]         = useState([]);
  const [speakers, setSpeakers]         = useState([]);
  const [topics, setTopics]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtersOpen, setFiltersOpen]   = useState(false); // mobile drawer

  const [filters, setFilters] = useState({
    search:    searchParams.get('search')    || '',
    speakerId: searchParams.get('speakerId') || '',
    topicId:   searchParams.getAll('topicId') || [],
    language:  searchParams.get('language')  || '',
    startDate: searchParams.get('startDate') || '',
    endDate:   searchParams.get('endDate')   || '',
    sort:      searchParams.get('sort')      || 'latest',
  });

  const languages = ['English', 'Urdu', 'Arabic', 'Others'];

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [speakersRes, topicsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/speakers'),
          axios.get('http://localhost:5000/api/topics'),
        ]);
        setSpeakers(speakersRes.data);
        setTopics(topicsRes.data);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search)    params.append('search',    filters.search);
        if (filters.speakerId) params.append('speakerId', filters.speakerId);
        if (filters.language)  params.append('language',  filters.language);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate)   params.append('endDate',   filters.endDate);
        if (filters.sort)      params.append('sort',      filters.sort);
        filters.topicId.forEach(id => params.append('topicId', id));
        const res = await axios.get(`http://localhost:5000/api/lectures?${params.toString()}`);
        setLectures(res.data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLectures();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentTopics = [...filters.topicId];
      if (checked) currentTopics.push(value);
      else currentTopics.splice(currentTopics.indexOf(value), 1);
      setFilters({ ...filters, topicId: currentTopics });
      setSearchParams({ ...Object.fromEntries(searchParams), topicId: currentTopics });
    } else {
      setFilters({ ...filters, [name]: value });
      const newParams = Object.fromEntries(searchParams);
      if (value) newParams[name] = value; else delete newParams[name];
      setSearchParams(newParams);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', speakerId: '', topicId: [], language: '', startDate: '', endDate: '', sort: 'latest' });
    setSearchParams({});
    setFiltersOpen(false);
  };

  const inputCls = 'w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white text-sm';

  const FilterPanel = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Search</label>
        <input type="text" name="search" value={filters.search} onChange={handleFilterChange}
          placeholder="Title or Speaker..." className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">From</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">To</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Speaker</label>
        <select name="speakerId" value={filters.speakerId} onChange={handleFilterChange} className={inputCls}>
          <option value="">All Speakers</option>
          {speakers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Language</label>
        <select name="language" value={filters.language} onChange={handleFilterChange} className={inputCls}>
          <option value="">All Languages</option>
          {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Topics</label>
        <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50 space-y-2">
          {topics.map(topic => (
            <label key={topic.id} className="flex items-center text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" name="topicId" value={topic.id}
                checked={filters.topicId.includes(topic.id.toString())}
                onChange={handleFilterChange}
                className="rounded text-primary focus:ring-primary border-gray-300 mr-2" />
              {topic.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Sort By</label>
        <select name="sort" value={filters.sort} onChange={handleFilterChange} className={inputCls}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <button onClick={resetFilters}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200">
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      {/* Mobile filter toggle button */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-2xl font-bold text-primary">Browse Lectures</h2>
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center gap-2 bg-white border border-gray-200 text-primary px-4 py-2 rounded-lg shadow-sm text-sm font-semibold"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {(filters.search || filters.speakerId || filters.language || filters.topicId.length > 0) && (
            <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {[filters.search, filters.speakerId, filters.language].filter(Boolean).length + filters.topicId.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="md:hidden mb-6 bg-white p-5 rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-primary">Filters</h3>
            <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <FilterPanel />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-full md:w-72 lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-24 border border-gray-100">
            <h3 className="text-lg font-bold text-primary mb-5 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Lecture Grid */}
        <div className="flex-1 min-w-0">
          <h2 className="hidden md:block text-3xl font-bold text-primary mb-8 border-b-2 border-gray-200 pb-4">
            Browse Lectures
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : lectures.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {lectures.map((lecture) => {
                let videoId = '';
                if (lecture.videoUrl && lecture.videoUrl.includes('youtube.com/watch?v=')) {
                  videoId = new URLSearchParams(new URL(lecture.videoUrl).search).get('v') || '';
                }
                return (
                  <div key={lecture.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col group">
                    <div className="relative pb-[56.25%] bg-gray-100">
                      {videoId ? (
                        <>
                          <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt={lecture.title}
                            className="absolute top-0 left-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-12 h-12 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      {lecture.language && (
                        <div className="absolute top-3 right-3 bg-primary text-secondary text-xs font-bold px-2 py-1 rounded shadow">
                          {lecture.language}
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5 flex-grow flex flex-col">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {lecture.topics?.slice(0, 2).map((topic) => (
                          <span key={topic.id} className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {topic.name}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                        <Link to={`/lectures/${lecture.id}`} className="hover:text-primary transition-colors">
                          {lecture.title}
                        </Link>
                      </h3>
                      <p className="text-gray-500 text-sm flex-grow line-clamp-2 mb-3">{lecture.description}</p>
                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <Link to={`/speakers/${lecture.speakerId}`}
                          className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-primary transition-colors">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {lecture.speaker?.name?.charAt(0)}
                          </div>
                          <span className="truncate">{lecture.speaker?.name}</span>
                        </Link>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {lecture.date ? new Date(lecture.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-gray-200 p-10 md:p-16 text-center text-gray-500">
              <svg className="w-14 h-14 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">No lectures found matching your criteria.</p>
              <button onClick={resetFilters} className="mt-4 text-primary font-semibold hover:underline text-sm">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lectures;
