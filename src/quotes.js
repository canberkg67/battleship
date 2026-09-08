export const victoryQuotes = [
    "Victory belongs to those who can say, ‘Victory is mine!",
    "Throughout your life advance daily, becoming more skillful than yesterday.",
    "In the end the winner is still the last man standing.",
    "The harder the battle, the sweeter the victory.",
    "For victory is victory, however small, nor is its worth only from what follows from it."
];

export const defeatQuotes = [
    "There is no hopeless situation, there are hopeless people.",
    "Never,in nothing great or small, large or petty, never give in.",
    "I have not failed. I've just found 10,000 ways that won't work.",
    "What does not kill me makes me stronger.",
    "The moment you give up is the moment you lose."
];

export function getRandomQuote(isVictory) {
    const quotes = isVictory ? victoryQuotes : defeatQuotes;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    return `“${selectedQuote}”`;
}