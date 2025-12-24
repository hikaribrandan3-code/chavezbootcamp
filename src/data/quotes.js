/**
 * Chavez Bootcamp - Motivational Quotes Database
 */

export const QUOTES = [
    "If you start today, don't give up.",
    "Believe in yourself. You can do it.",
    "One more day. Your future self will thank you.",
    "You're doing this for your health. For your family.",
    "Pain is temporary. Regret lasts forever.",
    "The only bad workout is the one that didn't happen.",
    "Discipline is choosing between what you want now and what you want most.",
    "Progress, not perfection.",
    "You don't have to be great to start, but you have to start to be great.",
    "The hardest lift is lifting your ass off the couch.",
    "Excuses don't burn calories.",
    "Sweat is just fat crying.",
    "Your body can stand almost anything. It's your mind you have to convince.",
    "Fall seven times, stand up eight.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Don't stop when you're tired. Stop when you're done.",
    "Success starts with self-discipline.",
    "You're not tired. You're uninspired.",
    "The best project you'll ever work on is you.",
    "Your only limit is you.",
    "What seems impossible today will become your warm-up tomorrow.",
    "Champions train, losers complain.",
    "Be stronger than your excuses.",
    "Wake up with determination. Go to bed with satisfaction.",
    "The body achieves what the mind believes.",
    "You're one workout away from a good mood.",
    "Stop wishing. Start doing.",
    "Hustle for that muscle.",
    "Don't wish for a good body. Work for it.",
    "It never gets easier. You just get stronger.",
    "Train insane or remain the same.",
    "Sore today, strong tomorrow.",
    "Every workout is progress.",
    "Respect your body. It's the only one you get.",
    "Dead last is greater than did not finish, which is greater than did not start.",
    "The only way to finish is to start.",
    "Small daily improvements are the key to staggering long-term results.",
    "If it doesn't challenge you, it won't change you.",
    "You're either getting better or you're getting worse.",
    "The difference between try and triumph is a little umph.",
    "Make yourself proud.",
    "Fitness is not about being better than someone else. It's about being better than you used to be.",
    "Strive for progress, not perfection.",
    "Your health is an investment, not an expense.",
    "A one hour workout is 4% of your day. No excuses.",
    "Push yourself because no one else is going to do it for you.",
    "Suffering is optional.",
    "Go the extra mile. It's never crowded.",
    "You are your only limit.",
    "The start is what stops most people.",
    "Action is the foundational key to all success.",
    "Strength does not come from physical capacity. It comes from an indomitable will.",
    "Motivation gets you started. Habit keeps you going.",
    "The clock is ticking. Are you becoming the person you want to be?",
    "Make each day your masterpiece.",
    "Take care of your body. It's the only place you have to live.",
    "Energy and persistence conquer all things.",
    "Do something today that your future self will thank you for.",
    "When you want to succeed as bad as you want to breathe, then you'll be successful.",
    "Obsessed is a word the lazy use to describe the dedicated.",
    "No matter how slow you go, you're still lapping everyone on the couch.",
    "Winners are not people who never fail. They are people who never quit.",
    "If you want something you've never had, you must be willing to do something you've never done.",
    "Results happen over time, not overnight. Work hard, stay consistent, and be patient.",
    "Don't let the scale define you. Be active, be healthy, be happy.",
    "Nothing will work unless you do.",
    "Fitness is like a relationship. You can't cheat and expect it to work.",
    "Train like a beast. Look like a beauty.",
    "The pain of discipline is nothing like the pain of disappointment.",
    "Good things come to those who sweat.",
    "Every accomplishment starts with the decision to try.",
    "Doubt kills more dreams than failure ever will.",
    "Your body hears everything your mind says. Stay positive.",
    "You didn't come this far to only come this far.",
    "Be patient and tough. Someday this pain will be useful to you.",
    "Set goals. Crush them. Repeat.",
    "The secret to getting ahead is getting started.",
    "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
    "The only person you are destined to become is the person you decide to be.",
    "A year from now you'll wish you had started today.",
    "Believe you can and you're halfway there.",
    "Work until your idols become your rivals.",
    "Never give up on a dream just because of the time it will take to accomplish it.",
    "Your future is created by what you do today, not tomorrow.",
    "The harder you work, the luckier you get.",
    "Don't stop until you're proud.",
    "Suffer the pain of discipline or suffer the pain of regret.",
    "No one is coming to save you. This is all your responsibility.",
    "The comeback is always stronger than the setback.",
    "You don't get the ass you want by sitting on it.",
    "Be so good they can't ignore you.",
    "Your body is not Amazon Prime. Results don't come in two days.",
    "Nobody cares about your excuses. Nobody pities you for procrastinating.",
    "Work in silence. Let your success make the noise.",
    "Comfort is the enemy of progress.",
    "Be addicted to bettering yourself.",
    "Stay dedicated. It's not going to be easy, but it's going to be worth it.",
    "Your limitation is only your imagination.",
    "Don't decrease the goal. Increase the effort.",
    "The body is not built in a day, but every day we build the body."
]

/**
 * Get today's motivational quote
 * Rotates daily based on day of year
 */
export function getDailyQuote() {
    const today = new Date()
    const start = new Date(today.getFullYear(), 0, 0)
    const diff = today - start
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    return QUOTES[dayOfYear % QUOTES.length]
}

/**
 * Get a random quote
 */
export function getRandomQuote() {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}
