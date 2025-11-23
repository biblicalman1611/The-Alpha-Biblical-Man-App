import { BlogPost, Product } from './types';

const PLACEHOLDER_TEXT_1 = `
<p>We have forgotten what it means to be men. Not the caricature of masculinity—the loud, boorish, dominate-at-all-costs version that the world parades—but the quiet, immovable strength of the ancient paths.</p>
<p>To be a Biblical man is to accept the burden of responsibility. It is to realize that your life is not your own. It belongs to your Creator, and by extension, to those He has placed under your care.</p>
<h3>The Cost of Passivity</h3>
<p>The first sin of man was not eating the fruit; it was standing by silently while it happened. Adam was with Eve, yet he said nothing. This passivity is the plague of the modern male. We retreat into video games, into work, into distraction, leaving the spiritual guarding of our homes to chance.</p>
<p>But the call remains: "Act like men, be strong" (1 Corinthians 16:13).</p>
<h3>The Path Forward</h3>
<p>We must reclaim the discipline of the inner life. Before you can lead a family, you must lead yourself. This begins in the quiet hours of the morning, in the rejection of easy pleasures, and in the embrace of hard things.</p>
`;

const PLACEHOLDER_TEXT_2 = `
<p>There is a paradox in the Kingdom of God: the way up is down. The world tells you that to be a leader, you must assert yourself, you must be the "Alpha". Christ tells us that to lead, we must serve.</p>
<p>Consider the Centurion in Matthew 8. He understood authority not because he could command, but because he was under command. "For I also am a man under authority, having soldiers under me."</p>
<h3>True Authority</h3>
<p>You cannot have authority over what you will not submit to. If you are not under the authority of God, your authority over your household is illegitimate. It becomes tyranny.</p>
<p>Submission is not weakness. It is strength harnessed. It is the bit in the mouth of the warhorse. Without it, the horse is wild and useless. With it, the horse is a weapon of war.</p>
`;

const PLACEHOLDER_TEXT_3 = `
<p>What will remain when you are gone? Your bank account will be emptied. Your house will be sold. Your job title will be filled by another within a week.</p>
<p>The only thing that echoes into eternity is the spiritual deposit you leave in the souls of your children.</p>
<h3>More Than Wealth</h3>
<p>We spend decades building financial portfolios but minutes building spiritual ones. We teach our sons how to throw a ball but not how to pray. We teach our daughters how to be successful but not how to be holy.</p>
<p>Legacy requires intentionality. It requires sitting down at the dinner table and speaking of the things of God (Deuteronomy 6). It requires you to be the priest of your home, not just the provider.</p>
`;

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Lost Art of Biblical Masculinity",
    excerpt: "Rediscovering what it means to be a man of God in a culture that has forgotten the ancient paths.",
    date: "Latest",
    readTime: "6 min read",
    category: "Manhood",
    link: "https://biblicalman.substack.com",
    content: PLACEHOLDER_TEXT_1
  },
  {
    id: '2',
    title: "Strength in Submission",
    excerpt: "Why true authority is always derived from being under authority. A look at the centurion's faith.",
    date: "Popular",
    readTime: "5 min read",
    category: "Leadership",
    link: "https://biblicalman.substack.com",
    content: PLACEHOLDER_TEXT_2
  },
  {
    id: '3',
    title: "Building a Legacy of Faith",
    excerpt: "Practical steps to ensure your children and grandchildren inherit more than just your wealth.",
    date: "Essay",
    readTime: "4 min read",
    category: "Family",
    link: "https://biblicalman.substack.com",
    content: PLACEHOLDER_TEXT_3
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: "The Biblical Man Bundle",
    description: "The complete collection of resources to help you lead your family and community with conviction.",
    price: "Check Price",
    imageUrl: "https://picsum.photos/seed/biblical1/400/500?grayscale",
    cta: "View on Gumroad",
    link: "https://biblicalman.gumroad.com"
  },
  {
    id: 'p2',
    name: "Spiritual Discipline Guide",
    description: "A practical framework for prayer, fasting, and scripture memory designed for the busy man.",
    price: "Check Price",
    imageUrl: "https://picsum.photos/seed/biblical2/401/500?grayscale",
    cta: "Get the Guide",
    link: "https://biblicalman.gumroad.com"
  }
];