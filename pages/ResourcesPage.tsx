import React from 'react';
import { RESOURCES, VIDEO_RESOURCES } from '../constants';
import type { Resource, VideoResource } from '../types';

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
    const cardColors = {
        helpline: 'border-red-500/50 hover:bg-red-500/10',
        guide: 'border-calm-green-500/50 hover:bg-calm-green-500/10',
        counselor: 'border-calm-blue-500/50 hover:bg-calm-blue-500/10',
    };

    return (
        <a href={resource.link} target="_blank" rel="noopener noreferrer" className={`block bg-slate-800 p-6 rounded-lg border-2 transition-colors duration-300 ${cardColors[resource.type]}`}>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">{resource.title}</h3>
            <p className="text-slate-400">{resource.description}</p>
        </a>
    );
};

const VideoCard: React.FC<{ video: VideoResource }> = ({ video }) => {
    return (
        <div className="bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700/50 flex flex-col">
            <div className="w-full aspect-video">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen>
                </iframe>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-100 mb-1">{video.title}</h3>
                <p className="text-slate-400 text-sm">{video.description}</p>
            </div>
        </div>
    );
};


const ResourcesPage: React.FC = () => {
    const helplines = RESOURCES.filter(r => r.type === 'helpline');
    const guides = RESOURCES.filter(r => r.type === 'guide');
    const counselors = RESOURCES.filter(r => r.type === 'counselor');

    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Help & Resources</h1>
                <p className="max-w-2xl mx-auto text-slate-400 mt-4">A curated list of tools and support systems. You are not alone.</p>
            </div>
            
            <div className="space-y-12">
                {/* Crisis Helplines */}
                <div>
                    <h2 className="text-3xl font-bold text-red-400 mb-6 border-b-2 border-red-500/30 pb-2">Immediate Crisis Support</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {helplines.map(resource => <ResourceCard key={resource.title} resource={resource} />)}
                    </div>
                </div>

                {/* Educational Videos */}
                <div>
                    <h2 className="text-3xl font-bold text-calm-blue-400 mb-6 border-b-2 border-calm-blue-500/30 pb-2">Educational Videos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {VIDEO_RESOURCES.map(video => <VideoCard key={video.videoId} video={video} />)}
                    </div>
                </div>

                {/* Self-Help Guides */}
                <div>
                    <h2 className="text-3xl font-bold text-calm-green-400 mb-6 border-b-2 border-calm-green-500/30 pb-2">Self-Help Guides & Tools</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {guides.map(resource => <ResourceCard key={resource.title} resource={resource} />)}
                    </div>
                </div>

                {/* Professional Help */}
                <div>
                    <h2 className="text-3xl font-bold text-calm-blue-400 mb-6 border-b-2 border-calm-blue-500/30 pb-2">Professional Help</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {counselors.map(resource => <ResourceCard key={resource.title} resource={resource} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourcesPage;