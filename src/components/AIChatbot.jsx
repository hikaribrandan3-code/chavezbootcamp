/**
 * Chavez Bootcamp - AI Coach Chatbot
 * Military-style personal trainer powered by DeepSeek via OpenRouter
 */

import { useState, useRef, useEffect } from 'react'
import { getUserProfile, getWorkoutPlan, getCurrentStreak, getLatestWeight, getWeightProgress, getChatHistory, addChatMessage } from '../utils/storage.js'
import './AIChatbot.css'

// OpenRouter API Configuration
const OPENROUTER_API_KEY = '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'
const OPENROUTER_MODEL = 'nex-agi/deepseek-v3.1-nex-n1:free'
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Coach System Prompt
const COACH_SYSTEM_PROMPT = `ROLE:
You are a 40-year-old personal trainer and health coach with 10+ years of military service. You've trained hundreds of people, from raw recruits to comeback athletes. You understand busy lives, real-world constraints, and the mental game of fitness. You are direct, no-nonsense, and a little bit of a dick—but always respectful. You don't coddle people. You push them to be better, call out excuses, but you're not abusive. You're their coach, not their friend.

PERSONALITY TRAITS:
- Direct and blunt
- Results-focused
- Zero tolerance for excuses, but understanding of real limitations
- Motivating through tough love
- Celebrates wins but immediately refocuses on the next goal
- Uses military/boot camp language sparingly (don't overdo it)
- Can be a bit rough but stays professional
- Always pushes for progress: "You can do one more." "Next week, we're adding weight."

RESPONSE FORMAT:
- Always respond in bullet points (3-5 max)
- Keep each bullet 1-2 sentences
- Be actionable and specific
- Reference the user's profile context when relevant

TONE EXAMPLES:
- "No barbell? Stop whining. Use what you got. Water jugs. Your backpack loaded with books. Get creative."
- "You said you only have 20 minutes? That's plenty. Drop the rest time to 30 seconds and move faster. Let's go."
- "Your shoulder hurts? Fine. We'll work around it. But you're not skipping today. Here's what you do instead."
- "You crushed that workout. Good. Next week, we're adding 5 lbs. No slacking."
- "You think you're done? Nah. I think you got one more rep in you. Prove me wrong."

PROGRESSIVE OVERLOAD PHILOSOPHY:
- Always look for opportunities to increase intensity
- If user says something was "easy," suggest adding weight, reps, or reducing rest time
- If user struggles, validate it but keep them moving forward
- Never let them plateau. Always push for incremental improvement.

CONSTRAINTS:
- Do NOT provide medical advice beyond general fitness guidance
- If user mentions severe pain or injury, tell them to see a doctor
- Keep responses SHORT and punchy. No walls of text.`

function AIChatbot({ onClose }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const messagesEndRef = useRef(null)
    const recognitionRef = useRef(null)

    // Load chat history on mount
    useEffect(() => {
        const history = getChatHistory()
        if (history.length > 0) {
            setMessages(history.slice(-20)) // Show last 20 messages
        } else {
            // Add welcome message
            setMessages([{
                role: 'assistant',
                content: "• Alright, soldier. I'm your coach.\n• Ask me about workouts, nutrition, or just tell me you're struggling.\n• I'll give it to you straight. No sugarcoating."
            }])
        }
    }, [])

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript
                setInput(transcript)
                setIsListening(false)
            }

            recognitionRef.current.onerror = () => {
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
        }
    }, [])

    // Get user context for AI
    function getUserContext() {
        const profile = getUserProfile()
        const plan = getWorkoutPlan()
        const streak = getCurrentStreak()
        const currentWeight = getLatestWeight()
        const progress = getWeightProgress()

        if (!profile) return ''

        return `
USER CONTEXT:
- Name: Soldier (default)
- Current Weight: ${currentWeight || profile.currentWeight} lbs
- Goal Weight: ${profile.goalWeight} lbs
- Goal: ${profile.goal || 'general fitness'}
- Progress: ${progress}% toward goal
- Current Streak: ${streak} days
- Workout Location: ${profile.workoutLocation || 'home'}
- Equipment: ${profile.equipment?.join(', ') || 'bodyweight only'}
- Injuries/Limitations: ${profile.injuries?.join(', ') || 'none'}
- Days/Week Available: ${profile.daysPerWeek || 3}
- Week Number: ${plan?.weekNumber || 1}
- Their "Why": ${profile.whyStatement || 'Not specified'}
`
    }

    // Send message to AI
    async function sendMessage(userMessage) {
        if (!userMessage.trim() || isLoading) return

        // Add user message
        const newUserMessage = { role: 'user', content: userMessage }
        setMessages(prev => [...prev, newUserMessage])
        addChatMessage('user', userMessage)
        setInput('')
        setIsLoading(true)

        try {
            const context = getUserContext()

            const response = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Chavez Bootcamp'
                },
                body: JSON.stringify({
                    model: OPENROUTER_MODEL,
                    messages: [
                        { role: 'system', content: COACH_SYSTEM_PROMPT + context },
                        ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 300,
                    temperature: 0.8
                })
            })

            if (!response.ok) {
                throw new Error('API request failed')
            }

            const data = await response.json()
            const assistantMessage = data.choices?.[0]?.message?.content || "• Something went wrong. Try again.\n• Don't give up that easy."

            // Format response to bullet points if not already
            let formattedMessage = assistantMessage
            if (!formattedMessage.includes('•') && !formattedMessage.includes('-')) {
                formattedMessage = formattedMessage.split('\n').filter(l => l.trim()).map(l => `• ${l}`).join('\n')
            }

            setMessages(prev => [...prev, { role: 'assistant', content: formattedMessage }])
            addChatMessage('assistant', formattedMessage)

        } catch (error) {
            console.error('AI Error:', error)
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "• Connection issue. Military-grade problems.\n• Try again, soldier. Don't quit on me."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    // Handle voice input
    function toggleVoiceInput() {
        if (!recognitionRef.current) {
            alert('Voice input not supported in this browser')
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    // Handle form submit
    function handleSubmit(e) {
        e.preventDefault()
        sendMessage(input)
    }

    // Quick prompts
    const quickPrompts = [
        "I don't have dumbbells",
        "Only 20 min today",
        "What should I eat?",
        "I want to quit"
    ]

    return (
        <div className="chatbot-overlay" onClick={onClose}>
            <div className="chatbot-container" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-title">
                        <span className="chatbot-icon">🎖️</span>
                        <div>
                            <h3>THE COACH</h3>
                            <span className="chatbot-status">Online • Ready to push you</span>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={onClose}>×</button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.role}`}>
                            <div className="message-content">
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-message assistant">
                            <div className="message-content typing">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                <div className="quick-prompts">
                    {quickPrompts.map((prompt, idx) => (
                        <button
                            key={idx}
                            className="quick-prompt-btn"
                            onClick={() => sendMessage(prompt)}
                            disabled={isLoading}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <form className="chatbot-input" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask your coach..."
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        className={`voice-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleVoiceInput}
                        disabled={isLoading}
                    >
                        🎤
                    </button>
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!input.trim() || isLoading}
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AIChatbot
