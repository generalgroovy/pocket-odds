# Pocket Odds

Choose a bag and collect a small set of colored stones while discovering how every draw changes the next chance.

Run `python -m http.server 8000`, then open http://localhost:8000. No installation, build or external dependencies. The first challenge has one bag and one **Draw a stone** action. In later challenges, select a bag with pointer or keyboard, then **Draw**. Four authored challenges move from one bag to adaptive choices among three bags. Every remaining stone is visible and labeled by color initial; color is not the only cue.

**Undo draw** restores the previous bags, pocket, selected bag and random state. **Replay options** contains **Retry same order**, which repeats the same seed; **New draw order** changes it. These are reproducible pseudorandom draws, without replacement. A draw can fail even when the chosen bag gave a good chance. Goal counts are minimums; extra colors do not spoil a set. Reload resets everything; no data is saved or uploaded.

**Draw probabilities** shows next-draw percentages and an exact dynamic-programming probability assuming the best adaptive bag choice at each subsequent draw. Rounded display percentages may not add to precisely 100%. The calculation applies only to these finite bags and goals, not to real-world prediction or full Mahjong strategy. There is no money, wagering or leaderboard.

Run `npm test`. Tests compare exact probability to independently calculable results, verify conservation/immutability/replay and search for a winning sequence for every default challenge. Human learning outcomes are not established by these software tests.
