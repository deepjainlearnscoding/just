import re

# Read the file
with open('game.html', 'r', encoding='utf-8') as f:
    content = f.read()

# New wheel prizes with 20 items
new_prizes = '''        const wheelPrizes = [
            "DARE: Give a passionate 15-second kiss",
            "TRUTH: What's the most romantic thing I've ever done for you?",
            "DARE: Whisper something flirty in my ear",
            "TRUTH: When did you first realize you were falling for me?",
            "DARE: Send me a voice note saying I love you in 3 different ways",
            "TRUTH: What's your favorite memory of us together?",
            "DARE: Sing a love song while looking into my eyes",
            "TRUTH: What do you love most about our relationship?",
            "DARE: Kiss me on my favorite spot",
            "TRUTH: What's one thing you've never told me but want to?",
            "DARE: Give me the tightest hug for 30 seconds",
            "TRUTH: How do I make you feel special?",
            "DARE: Write I love you on my hand and kiss it",
            "TRUTH: What's your favorite thing about my personality?",
            "DARE: Compliment me for 1 minute straight without stopping",
            "TRUTH: What's your biggest fear about losing me?",
            "DARE: Stare into my eyes without laughing for 30 seconds",
            "TRUTH: What's your dream date with me?",
            "DARE: Give me 5 kisses on different places",
            "TRUTH: How has loving me changed you?"
        ];'''

# Replace the wheelPrizes array
pattern = r'const wheelPrizes = \[[\s\S]*?\];'
content = re.sub(pattern, new_prizes, content)

# Update the calculation from 8 items to 20 items (360/8=45, 360/20=18)
content = content.replace('/ 45) % 8;', '/ 18) % 20;')

# Write back
with open('game.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated game.html with 20 dares and truths!")
