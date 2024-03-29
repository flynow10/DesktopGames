import { TwentyFourtyEight } from "@/games/2048/2048";
import { Connect4 } from "@/games/connect4/Connect4";
import { Maze } from "@/games/maze/Maze";
import { Snake } from "@/games/snake/Snake";
import { Tetris } from "@/games/tetris/Tetris";
import t from "@/i18n";
import MiniSearch from "minisearch";
import { Game } from "./Game";
export type GameIgniter = {
  id: string;
  name: string;
  imageUrl?: string;
  game: new () => Game;
};

const snake: GameIgniter = {
  id: "snake",
  name: t("snake-title"),
  game: Snake,
};

const connect4: GameIgniter = {
  id: "connect4",
  name: t("connect4-title"),
  game: Connect4,
};

const twentyFourtyEight: GameIgniter = {
  id: "2048",
  name: t("2048-title"),
  game: TwentyFourtyEight,
};

const tetris: GameIgniter = {
  id: "tetris",
  name: t("tetris-title"),
  game: Tetris,
};

const maze: GameIgniter = {
  id: "maze",
  name: t("maze-title"),
  game: Maze,
};

export const gameIgniters = [snake, connect4, twentyFourtyEight, tetris, maze];

const stopWords = [
  "a",
  "about",
  "above",
  "after",
  "again",
  "against",
  "all",
  "am",
  "an",
  "and",
  "any",
  "are",
  "aren't",
  "as",
  "at",
  "be",
  "because",
  "been",
  "before",
  "being",
  "below",
  "between",
  "both",
  "but",
  "by",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "did",
  "didn't",
  "do",
  "does",
  "doesn't",
  "doing",
  "don't",
  "down",
  "during",
  "each",
  "few",
  "for",
  "from",
  "further",
  "had",
  "hadn't",
  "has",
  "hasn't",
  "have",
  "haven't",
  "having",
  "he",
  "he'd",
  "he'll",
  "he's",
  "her",
  "here",
  "here's",
  "hers",
  "herself",
  "him",
  "himself",
  "his",
  "how",
  "how's",
  "i",
  "i'd",
  "i'll",
  "i'm",
  "i've",
  "if",
  "in",
  "into",
  "is",
  "isn't",
  "it",
  "it's",
  "its",
  "itself",
  "let's",
  "me",
  "more",
  "most",
  "mustn't",
  "my",
  "myself",
  "no",
  "nor",
  "not",
  "of",
  "off",
  "on",
  "once",
  "only",
  "or",
  "other",
  "ought",
  "our",
  "ours",
  "ourselves",
  "out",
  "over",
  "own",
  "same",
  "shan't",
  "she",
  "she'd",
  "she'll",
  "she's",
  "should",
  "shouldn't",
  "so",
  "some",
  "such",
  "than",
  "that",
  "that's",
  "the",
  "their",
  "theirs",
  "them",
  "themselves",
  "then",
  "there",
  "there's",
  "these",
  "they",
  "they'd",
  "they'll",
  "they're",
  "they've",
  "this",
  "those",
  "through",
  "to",
  "too",
  "under",
  "until",
  "up",
  "very",
  "was",
  "wasn't",
  "we",
  "we'd",
  "we'll",
  "we're",
  "we've",
  "were",
  "weren't",
  "what",
  "what's",
  "when",
  "when's",
  "where",
  "where's",
  "which",
  "while",
  "who",
  "who's",
  "whom",
  "why",
  "why's",
  "with",
  "won't",
  "would",
  "wouldn't",
  "you",
  "you'd",
  "you'll",
  "you're",
  "you've",
  "your",
  "yours",
  "yourself",
  "yourselves",
];
const minisearch = new MiniSearch({
  fields: ["name"],
  processTerm: (term) => (stopWords.includes(term) ? null : term.toLowerCase()),
  searchOptions: {
    processTerm: (term) => term.toLowerCase(),
  },
});

minisearch.addAll(gameIgniters);

export const getGames = (search: string = ""): GameIgniter[] => {
  if (search === "") {
    return gameIgniters;
  }
  const searchResults = minisearch
    .search(
      minisearch
        .autoSuggest(search)
        .map((res) => res.suggestion)
        .join(", ")
    )
    .map((res) => res.id);
  return gameIgniters.filter((game) => searchResults.includes(game.id));
};
