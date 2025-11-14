
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle form submission, e.g., send to an API endpoint.
        // For this demo, we'll just simulate it.
        console.log({ name, email, message });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-6 py-12 md:py-20 text-center">
                <div className="bg-slate-800/50 p-12 rounded-xl max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-calm-green-400 mb-4">Thank You!</h1>
                    <p className="text-slate-300">Your message has been sent. We'll get back to you as soon as possible.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-8 bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100">Contact Us</h1>
                <p className="max-w-2xl mx-auto text-slate-400 mt-4">Have questions or suggestions? We'd love to hear from you.</p>
            </div>

            <div className="max-w-xl mx-auto bg-slate-800/50 p-8 rounded-xl shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-calm-blue-500 focus:border-calm-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-calm-blue-500 focus:border-calm-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                        <textarea
                            id="message"
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-slate-100 focus:outline-none focus:ring-calm-blue-500 focus:border-calm-blue-500"
                        ></textarea>
                    </div>
                    <div>
                        <button type="submit" className="w-full bg-calm-blue-600 hover:bg-calm-blue-500 text-white font-bold py-3 px-4 rounded-md transition-colors duration-300">
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactPage;
