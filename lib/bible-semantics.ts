export interface SemanticData {
  variations: string[];
  themes: string[];
  related: string[];
}

export const BIBLE_SEMANTICS: Record<string, SemanticData> = {
  love: {
    variations: ["loves", "loved", "loving"],
    themes: ["charity", "affection", "kindness", "compassion"],
    related: ["grace", "mercy", "care", "favor", "heart"],
  },
  faith: {
    variations: ["faithful", "faithfully", "faithfulness", "believe", "believed", "believing"],
    themes: ["trust", "assurance", "confidence", "conviction"],
    related: ["hope", "steadfast", "loyalty", "truth"],
  },
  hope: {
    variations: ["hopes", "hoped", "hoping", "hopeful"],
    themes: ["expectation", "anticipation", "trust"],
    related: ["encouragement", "promise", "future", "patience"],
  },
  peace: {
    variations: ["peaceful", "peacemaker", "quiet", "still"],
    themes: ["shalom", "rest", "harmony", "calm"],
    related: ["comfort", "serenity", "safety", "tranquility"],
  },
  grace: {
    variations: ["gracious", "graciously"],
    themes: ["favor", "mercy", "blessing"],
    related: ["gift", "kindness", "forgiveness", "salvation"],
  },
  mercy: {
    variations: ["merciful", "mercies"],
    themes: ["compassion", "pity", "forbearance"],
    related: ["grace", "pardon", "clemency", "love"],
  },
  wisdom: {
    variations: ["wise", "wisely"],
    themes: ["understanding", "discernment", "knowledge", "insight"],
    related: ["prudence", "instruction", "fear of the Lord"],
  },
  strength: {
    variations: ["strong", "strengthen", "strengthened", "strengthening"],
    themes: ["power", "might", "courage", "fortitude"],
    related: ["refuge", "shield", "rock", "help"],
  },
  healing: {
    variations: ["heal", "heals", "healed", "health", "whole"],
    themes: ["restoration", "recovery", "cure"],
    related: ["comfort", "physician", "balm", "wholeness"],
  },
  prayer: {
    variations: ["pray", "prays", "prayed", "praying", "petition", "supplication"],
    themes: ["intercession", "communication", "communion"],
    related: ["ask", "seek", "knock", "thanksgiving"],
  },
  forgiveness: {
    variations: ["forgive", "forgives", "forgiven", "forgiving", "pardon"],
    themes: ["reconciliation", "mercy", "remission"],
    related: ["repentance", "grace", "cleansing", "peace"],
  },
  joy: {
    variations: ["rejoice", "rejoiced", "rejoicing", "joyful", "glad"],
    themes: ["happiness", "delight", "gladness", "celebration"],
    related: ["blessing", "praise", "exultation", "peace"],
  },
  trial: {
    variations: ["trials", "tested", "testing", "tempted", "temptation"],
    themes: ["suffering", "persecution", "hardship", "affliction"],
    related: ["endurance", "patience", "faith", "refinement"],
  },
  tribulation: {
    variations: ["tribulations", "trouble", "distress"],
    themes: ["suffering", "persecution", "affliction", "sorrow"],
    related: ["patience", "endurance", "hope", "overcome"],
  },
  kingdom: {
    variations: ["king", "kings", "reign", "dominion"],
    themes: ["heaven", "throne", "rule", "authority"],
    related: ["gospel", "glory", "inheritance", "power"],
  },
  god: {
    variations: ["lord", "father", "almighty", "creator"],
    themes: ["divine", "holy", "spirit", "deity"],
    related: ["savior", "christ", "jesus", "heavenly"],
  },
  new: {
    variations: ["renew", "renewed", "renewal", "fresh", "novel"],
    themes: ["regeneration", "creation", "beginning", "change"],
    related: ["born again", "covenant", "heart", "spirit"],
  },
  work: {
    variations: ["works", "working", "deeds", "labor", "fruit"],
    themes: ["action", "service", "obedience", "faithfulness"],
    related: ["reward", "calling", "practice", "effort"],
  }
};

export function getSemanticKeywords(query: string): SemanticData | null {
  const lower = query.toLowerCase().trim();
  return BIBLE_SEMANTICS[lower] || null;
}
