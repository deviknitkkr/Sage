-- Insert initial badges for the badging system
INSERT INTO sage_db.badges (name, description, type, icon, criteria, is_active) VALUES
-- Bronze badges
('Student', 'Asked first question with score of 1 or more', 'BRONZE', '🎓', 'Ask first question', true),
('Teacher', 'Answered first question with score of 1 or more', 'BRONZE', '👨‍🏫', 'Answer first question', true),
('Editor', 'First edit', 'BRONZE', '✏️', 'Edit first post', true),
('Supporter', 'First upvote', 'BRONZE', '👍', 'Cast first upvote', true),
('Critic', 'First downvote', 'BRONZE', '👎', 'Cast first downvote', true),
('Commentator', 'Left 10 comments', 'BRONZE', '💬', 'Leave 10 comments', true),

-- Silver badges
('Nice Question', 'Question score of 10 or more', 'SILVER', '🥈', 'Question with 10+ score', true),
('Good Question', 'Question score of 25 or more', 'SILVER', '🥈', 'Question with 25+ score', true),
('Nice Answer', 'Answer score of 10 or more', 'SILVER', '🥈', 'Answer with 10+ score', true),
('Good Answer', 'Answer score of 25 or more', 'SILVER', '🥈', 'Answer with 25+ score', true),
('Enlightened', 'First answer was accepted with score of 10 or more', 'SILVER', '💡', 'Accepted answer with 10+ score', true),
('Inquisitive', 'Asked 10 well-received questions', 'SILVER', '🔍', 'Ask 10 questions', true),
('Established', 'Reached 500 reputation', 'SILVER', '⭐', 'Earn 500 reputation', true),

-- Gold badges
('Great Question', 'Question score of 100 or more', 'GOLD', '🏆', 'Question with 100+ score', true),
('Great Answer', 'Answer score of 100 or more', 'GOLD', '🏆', 'Answer with 100+ score', true),
('Famous Question', 'Question with 10,000 views', 'GOLD', '👁️', 'Question with 10k views', true),
('Socratic', 'Asked 50 well-received questions', 'GOLD', '🤔', 'Ask 50 questions', true),
('Guru', 'Accepted answer and score of 40 or more', 'GOLD', '🧙‍♂️', 'Answer with 40+ score accepted', true),
('Notable', 'Reached 1000 reputation', 'GOLD', '🌟', 'Earn 1000 reputation', true),
('Trusted', 'Reached 5000 reputation', 'GOLD', '🛡️', 'Earn 5000 reputation', true),
('Famous', 'Reached 10000 reputation', 'GOLD', '👑', 'Earn 10000 reputation', true);
