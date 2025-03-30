import React, { useState, useCallback } from 'react';
import { BookOpen, ListChecks, ArrowDownUp, Pencil, Clock, AlertTriangle, Lightbulb, BookMarked, Search, CheckCircle, XCircle, Upload, Image as ImageIcon, Type, FileText, CheckSquare } from 'lucide-react';

// Question type data
const questionTypes = [
  {
    id: 'reading-writing-fill-blanks',
    title: 'Reading & Writing: Fill in the Blanks',
    icon: Type,
    timeAllocation: '2-3 minutes per question',
    skills: ['Reading comprehension', 'Vocabulary', 'Grammar', 'Contextual understanding'],
    format: 'Text with gaps where you need to choose the correct word from a dropdown list',
    scoring: 'Partial credit for each correct word',
    strategies: [
      'Read the entire paragraph first to understand context',
      'Look for grammatical clues (e.g., parts of speech)',
      'Check for collocations and common phrases'
    ],
    pitfalls: [
      'Choosing words based only on meaning without considering grammar',
      'Not reading before and after the blank',
      'Missing contextual clues from the broader passage'
    ],
    samples: [
      {
        question: 'The economic _____ of the country depends largely on its natural resources.',
        options: ['prosperity', 'wealth', 'richness', 'fortune'],
        solution: 'The correct answer is "prosperity". This collocates naturally with "economic" and fits the context of national development.'
      }
    ]
  },
  {
    id: 'multiple-choice-multiple',
    title: 'Multiple Choice (Multiple)',
    icon: CheckSquare,
    timeAllocation: '2-3 minutes per question',
    skills: ['Reading comprehension', 'Critical analysis', 'Detail identification'],
    format: 'Questions with multiple correct answers that must all be selected',
    scoring: 'Partial credit available based on number of correct selections',
    strategies: [
      'Read the question carefully to note it requires multiple answers',
      'Evaluate each option independently',
      'Cross-reference with the text for each choice'
    ],
    pitfalls: [
      'Missing some correct answers',
      'Selecting partially correct options',
      'Not verifying each choice with the text'
    ],
    samples: [
      {
        question: 'Which of the following factors contribute to climate change according to the passage?',
        options: ['Industrial emissions', 'Deforestation', 'Ocean acidification', 'Urban development'],
        solution: 'Analyze each option separately and find evidence in the text for each selection.'
      }
    ]
  },
  {
    id: 'reorder-paragraphs',
    title: 'Re-order Paragraphs',
    icon: ArrowDownUp,
    timeAllocation: '2-3 minutes per set',
    skills: ['Logical flow recognition', 'Coherence understanding', 'Text organization'],
    format: 'Jumbled paragraphs that need to be arranged in correct order',
    scoring: 'Points awarded for correct pairs of adjacent paragraphs',
    strategies: [
      'Identify the topic sentence (usually first)',
      'Look for connecting words and references',
      'Check logical progression of ideas'
    ],
    pitfalls: [
      'Ignoring transition words',
      'Not considering chronological order',
      'Missing pronoun references'
    ],
    samples: [
      {
        paragraphs: ['The Industrial Revolution began', 'This led to urbanization', 'Modern cities emerged'],
        solution: 'Start by identifying the introduction paragraph...'
      }
    ]
  },
  {
    id: 'reading-fill-blanks',
    title: 'Reading: Fill in the Blanks',
    icon: FileText,
    timeAllocation: '1.5-2 minutes per question',
    skills: ['Vocabulary', 'Context understanding', 'Grammar knowledge'],
    format: 'Text with gaps where you need to select words from given options',
    scoring: 'One point per correct answer',
    strategies: [
      'Read the entire sentence first',
      'Check grammar compatibility',
      'Consider collocations'
    ],
    pitfalls: [
      'Not checking surrounding context',
      'Ignoring word form',
      'Selecting based on meaning alone'
    ],
    samples: [
      {
        text: 'The _____ of the experiment was carefully documented.',
        options: ['procedure', 'process', 'protocol'],
        solution: 'Analyze the context and common collocations...'
      }
    ]
  },
  {
    id: 'multiple-choice-single',
    title: 'Multiple Choice (Single)',
    icon: ListChecks,
    timeAllocation: '2 minutes per question',
    skills: ['Reading comprehension', 'Main idea identification', 'Detail analysis'],
    format: 'Questions with one correct answer from multiple options',
    scoring: 'One point per correct answer',
    strategies: [
      'Read the question before reading the passage',
      'Eliminate obviously wrong answers',
      'Look for specific evidence in the text'
    ],
    pitfalls: [
      'Choosing based on prior knowledge instead of text',
      'Selecting partially correct answers',
      'Not verifying answer with text evidence'
    ],
    samples: [
      {
        question: 'What is the main purpose of the passage?',
        options: ['To inform', 'To persuade', 'To entertain', 'To criticize'],
        solution: 'Look for the overall tone and structure of the passage...'
      }
    ]
  }
];

function App() {
  const [selectedType, setSelectedType] = useState(questionTypes[0]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisInput, setAnalysisInput] = useState({
    passage: '',
    question: '',
    selectedAnswer: '',
    correctAnswer: '',
    imageUrl: ''
  });
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnalysisInput(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnalysisInput(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisInput),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data.analysis);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisResult(`Error analyzing answer: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">PTE Reading Analysis Guide</h1>
            </div>
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Search className="h-5 w-5 mr-2" />
              Answer Analysis
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {showAnalysis ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analyze Your Answer</h2>
            <form onSubmit={handleAnalysisSubmit} className="space-y-6">
              {/* Image Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300 bg-white'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload question image</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                {analysisInput.imageUrl && (
                  <div className="mt-4">
                    <img
                      src={analysisInput.imageUrl}
                      alt="Uploaded question"
                      className="max-w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passage Text
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  value={analysisInput.passage}
                  onChange={(e) => setAnalysisInput({...analysisInput, passage: e.target.value})}
                  placeholder="Paste the reading passage here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  value={analysisInput.question}
                  onChange={(e) => setAnalysisInput({...analysisInput, question: e.target.value})}
                  placeholder="Enter the question..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={analysisInput.selectedAnswer}
                    onChange={(e) => setAnalysisInput({...analysisInput, selectedAnswer: e.target.value})}
                    placeholder="Enter your answer..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    value={analysisInput.correctAnswer}
                    onChange={(e) => setAnalysisInput({...analysisInput, correctAnswer: e.target.value})}
                    placeholder="Enter the correct answer..."
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isAnalyzing}
                className={`w-full py-3 px-4 ${
                  isAnalyzing 
                    ? 'bg-indigo-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white rounded-lg transition-colors`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Answer'}
              </button>
            </form>
            {analysisResult && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Result</h3>
                <pre className="whitespace-pre-wrap text-gray-600">{analysisResult}</pre>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Question Type Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {questionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 rounded-lg shadow-sm ${
                    selectedType.id === type.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <type.icon className="h-6 w-6 mb-2" />
                  <h3 className="font-medium">{type.title}</h3>
                </button>
              ))}
            </div>

            {/* Selected Question Type Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <selectedType.icon className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{selectedType.title}</h2>
              </div>

              {/* Time Allocation */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Time Allocation</h3>
                </div>
                <p className="text-gray-600">{selectedType.timeAllocation}</p>
              </div>

              {/* Format & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Format</h3>
                  <p className="text-gray-600">{selectedType.format}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills Tested</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedType.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Strategies */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Proven Strategies</h3>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedType.strategies.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>

              {/* Pitfalls */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Common Pitfalls</h3>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedType.pitfalls.map((pitfall, index) => (
                    <li key={index}>{pitfall}</li>
                  ))}
                </ul>
              </div>

              {/* Sample Questions */}
              <div>
                <div className="flex items-center mb-2">
                  <BookMarked className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">Sample Questions</h3>
                </div>
                {selectedType.samples.map((sample, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-medium mb-2">{sample.question || 'Example:'}</p>
                    {sample.options && (
                      <ul className="list-disc list-inside mb-2">
                        {sample.options.map((option, i) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    )}
                    {sample.paragraphs && (
                      <ul className="list-decimal list-inside mb-2">
                        {sample.paragraphs.map((para, i) => (
                          <li key={i}>{para}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-2">
                      <p className="font-medium">Solution:</p>
                      <p className="text-gray-600">{sample.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;