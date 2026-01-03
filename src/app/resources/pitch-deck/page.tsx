"use client";
import { Download, Visibility, School } from "@mui/icons-material";
import Link from "next/link";

export default function PitchDeckResources() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <School className="text-blue-500" fontSize="large" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pitch Deck Resources</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Templates, examples, and best practices for creating your pitch deck
          </p>
        </div>

        {/* Submit Link Banner */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-blue-800 dark:text-blue-200 mb-2">
            Ready to submit? Head to the submission page:
          </p>
          <Link
            href="/hackathon/pitch-deck"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Submit Your Pitch Deck →
          </Link>
        </div>

        {/* Download Template */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-800 mb-8">
          <div className="flex items-start gap-4">
            <Download className="text-blue-600 dark:text-blue-400" fontSize="large" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Download Pitch Deck Template
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Start with our professionally designed template. Includes all essential slides with
                helpful tips and guidelines.
              </p>
              <a
                href="/resources/pitch-deck-template.pptx"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Download />
                Download Template (PPTX)
              </a>
            </div>
          </div>
        </div>

        {/* Example Pitch Deck */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Visibility className="text-green-600 dark:text-green-400" fontSize="large" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Example Pitch Deck
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Study this award-winning pitch deck to understand what makes a great presentation.
          </p>

          {/* PDF Viewer */}
          <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <iframe
              src="/resources/example-pitch-deck.pdf"
              className="w-full h-[600px]"
              title="Example Pitch Deck"
            />
          </div>
          
          <div className="mt-4 flex justify-center">
            <a
              href="/resources/example-pitch-deck.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Visibility />
              Open in New Tab
            </a>
          </div>
        </div>

        {/* Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ✅ Do's
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Keep it concise - 10-15 slides maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Use clear, large fonts (minimum 24pt)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Include visuals - charts, screenshots, mockups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Tell a story - problem, solution, impact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Highlight your unique value proposition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400">•</span>
                <span>Show a working demo or prototype</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ❌ Don'ts
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Overcrowd slides with too much text</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Use small, unreadable fonts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Include irrelevant information or filler</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Make it too technical for general audience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Forget to proofread for typos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400">•</span>
                <span>Use distracting animations or transitions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recommended Structure */}
        <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📋 Recommended Slide Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: 1, title: "Title Slide", desc: "Team name, project name, tagline" },
              { num: 2, title: "Problem", desc: "What problem are you solving?" },
              { num: 3, title: "Solution", desc: "Your innovative solution" },
              { num: 4, title: "How It Works", desc: "Technical implementation overview" },
              { num: 5, title: "Demo", desc: "Screenshots or video walkthrough" },
              { num: 6, title: "Market/Impact", desc: "Who benefits and how?" },
              { num: 7, title: "Technology Stack", desc: "Tools and frameworks used" },
              { num: 8, title: "Challenges", desc: "Obstacles overcome" },
              { num: 9, title: "Future Plans", desc: "Next steps and scalability" },
              { num: 10, title: "Team", desc: "Meet the team members" },
              { num: 11, title: "Thank You", desc: "Contact information and Q&A" },
            ].map((slide) => (
              <div
                key={slide.num}
                className="bg-white dark:bg-[#0a0a0a] rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {slide.num}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{slide.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{slide.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💡 Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Design</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Use consistent color scheme (2-3 colors max)</li>
                <li>• High contrast for readability</li>
                <li>• Professional fonts (avoid Comic Sans!)</li>
                <li>• White space is your friend</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• One main idea per slide</li>
                <li>• Use bullet points, not paragraphs</li>
                <li>• Data visualization over raw numbers</li>
                <li>• Show, don't just tell</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delivery</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Practice your timing (5-7 minutes)</li>
                <li>• Prepare for technical difficulties</li>
                <li>• Have backup plan (PDF version)</li>
                <li>• Rehearse transitions between speakers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Impact</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Start strong with a hook</li>
                <li>• End with clear call-to-action</li>
                <li>• Tell a compelling story</li>
                <li>• Show passion and enthusiasm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
