import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { bibleBooks } from "@/data/bible"
import { Breadcrumb } from "@/components/breadcrumb"
import { TableOfContents, type Heading } from "@/components/table-of-contents"
import { BibleLinkifiedText } from "@/components/bible-linkified-text"

export const metadata: Metadata = {
  title: "Complete List of 66 Books of the Bible - Old & New Testament",
  description:
    "Discover the complete list of all 66 books of the Bible in order. Learn about the 39 Old Testament and 27 New Testament books, their history, and chronological order.",
  keywords: ["bible books", "66 books of the bible", "old testament books list", "new testament books list", "chronological order of bible books", "bible study guide", "scripture overview", "holy bible books", "bible chapters count"],
  openGraph: {
    title: "Complete List of 66 Books of the Bible - Old & New Testament",
    description:
      "A comprehensive guide to all 66 books of the Bible, including Old and New Testaments, chronological order, and summaries.",
    type: "article",
    images: [{ url: "/list-of-books-of-the-bible.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Complete List of 66 Books of the Bible",
    description: "Explore the 66 books of the Bible with this complete guide and chronological list.",
    images: ["/list-of-books-of-the-bible.webp"],
  },
  alternates: { canonical: "https://prayerverses.com/books-of-the-bible/" },
  robots: { index: true, follow: true },
}

export default function BooksOfTheBiblePage() {
  const ot = bibleBooks.filter((b) => b.testament === "OT")
  const nt = bibleBooks.filter((b) => b.testament === "NT")

  const headings: Heading[] = [
    { id: "what-are-the-books-of-the-bible", text: "What Are the Books of the Bible?" },
    { id: "why-are-they-called-books", text: "Why Are They Called 'Books'?" },
    { id: "why-is-the-bible-divided", text: "Why Is the Bible Divided into Old and New Testament?" },
    { id: "chronological-order-list", text: "Books of the Bible List in Chronological Order" },
    { id: "how-many-books-in-ot", text: "How Many Books in the Old Testament?" },
    { id: "how-many-books-in-nt", text: "How Many Books in the New Testament?" },
    { id: "why-are-these-books-important", text: "Why Are These Books Important?" },
    { id: "how-are-these-books-used-today", text: "How Are These Books Used Today?" },
  ]

  return (
    <>
      <Breadcrumb items={[{ label: "Books of the Bible", href: "/books-of-the-bible/" }]} />

      <article className="post-content prose prose-stone max-w-none prose-img:rounded-none prose-headings:font-serif">
        <h1 className="text-3xl lg:text-5xl font-serif font-bold text-card-foreground mb-6">
          Complete List of 66 Books of the Bible
        </h1>

        <Image
          src="/list-of-books-of-the-bible.webp"
          alt="List of Books of the Bible Illustration"
          width={1200}
          height={630}
          className="w-full h-auto rounded-none shadow-md mb-8"
          priority
        />

        <p className="lead">
          The Bible is made up of 66 books, each carrying a unique message that forms the foundation of faith and spiritual wisdom. From the creation story in Genesis to the final revelations of eternity, every book contributes to a divine narrative connecting God and humanity.
        </p>

        <p>
          Understanding the order of these books helps us see how history, prophecy, poetry, and teachings fit together as one continuous story. In this guide, you&apos;ll find the complete list of all 66 books of the Bible, arranged clearly by the Old and New Testament.
        </p>

        <TableOfContents headings={headings} />

        <h2 id="what-are-the-books-of-the-bible">What Are the Books of the Bible?</h2>
        <p>
          The Bible is not a single book but a full collection of 66 individual books. Think of it like a library with different sections—each book stands on its own but connects to a larger story. These books were written by around 40 different authors, including kings, prophets, fishermen, and scholars.
        </p>
        <p>
          They were written over a time span of about 1,500 years, across regions like Israel, Egypt, Babylon, and the Roman Empire. This wide range of authors and places gives the Bible a mix of cultures, languages, and perspectives—yet the message remains focused on God&apos;s relationship with people.
        </p>

        <p>These books include many styles of writing:</p>
        <ul>
          <li><strong>Laws</strong>, such as rules given to Israel in Leviticus</li>
          <li><strong>History</strong>, like the journeys of the Israelites in 1 &amp; 2 Kings</li>
          <li><strong>Poetry and songs</strong>, found in Psalms and Song of Solomon</li>
          <li><strong>Prophecies</strong>, like those in Isaiah and Daniel</li>
          <li><strong>Wise sayings</strong>, especially in Proverbs and Ecclesiastes</li>
          <li><strong>Teachings and letters</strong>, mostly in the New Testament, like Romans or 1 Peter</li>
        </ul>

        <p>The Bible is split into two big sections:</p>
        <ul>
          <li>The <strong>Old Testament</strong> focuses on God&apos;s covenant with Israel and includes creation, the law, and the prophets.</li>
          <li>The <strong>New Testament</strong> focuses on the life of Jesus Christ, His teachings, and how the church began.</li>
        </ul>
        <p>
          Each part supports the other. Together, they show a full picture of God&apos;s promises, character, and plan for humanity.
        </p>

        <h2 id="why-are-they-called-books">Why Are They Called &ldquo;Books&rdquo;?</h2>
        <p>
          In Bible terms, a &ldquo;book&rdquo; is not like a modern paperback or novel. Each book was originally written on a scroll or handwritten manuscript. Over time, they were copied and collected into one larger volume—the Bible.
        </p>
        <p>
          Each one is called a book because it has its own title, author, and purpose. These were not all written at once or by one person. For example:
        </p>
        <ul>
          <li>Genesis was written by Moses and talks about the beginning of the world.</li>
          <li>Psalms is a book of songs and prayers, mostly by King David.</li>
          <li>Luke was written by a doctor named Luke, who told the story of Jesus&apos; life.</li>
        </ul>

        <p>Most books are named based on one of these ideas:</p>
        <ul>
          <li>The main person (like Matthew, named after the disciple who wrote it)</li>
          <li>The main topic or theme (like Genesis, which means &ldquo;beginning&rdquo;)</li>
          <li>The main event or group (like Acts, which covers the &ldquo;acts&rdquo; or actions of the early church)</li>
        </ul>
        <p>This naming system makes it easier to know what each book is about, even before reading it.</p>

        <h2 id="why-is-the-bible-divided">Why Is the Bible Divided into Old and New Testament?</h2>
        <p>
          The word &ldquo;Testament&rdquo; comes from a Latin word that means &ldquo;covenant&rdquo; or legal agreement. In the Bible, it refers to the relationship between God and humans. That&apos;s why the Bible is divided into two parts: the Old Testament and the New Testament—each representing a different phase of God&apos;s promise to His people.
        </p>
        <p>
          The Old Testament contains God&apos;s covenant with the people of Israel. It includes creation, the law given to Moses, stories of kings and prophets, and promises of a coming Savior. These books were written before the birth of Jesus Christ, and they lay the foundation for everything that comes after.
        </p>
        <p>
          The New Testament shows the fulfillment of that promise through the life, death, and resurrection of Jesus Christ. It introduces a new covenant, not just for Israel, but for all people, based on faith and grace instead of law. It teaches about Jesus&apos; message and how His followers spread that message throughout the world.
        </p>

        <h2 id="chronological-order-list">Books of the Bible List in Chronological Order</h2>
        <p>
          Here is a simplified list of Bible books arranged chronologically (based on the time events happened or were written). This helps in understanding the timeline of biblical history:
        </p>

        <div className="not-prose space-y-8 my-10">
          <section>
            <h3 className="text-xl font-bold mb-4">1. Genesis</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="The book of Genesis opens with the breathtaking story of creation (Genesis 1:1–31), where God forms the heavens, the earth, and all life. It moves through the lives of Adam and Eve, the fall into sin (Genesis 3:1–24), and the story of Noah’s Ark (Genesis 6:9–22). It continues with the journeys of the patriarchs—Abraham, Isaac, Jacob, and Joseph—showing God’s promises and covenant. Through these accounts, Genesis reveals the origins of humanity, the roots of Israel, and God’s plan for redemption." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">2. Job</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="The book of Job tells the moving story of a man tested by severe trials yet holding on to faith. Job loses his wealth, family, and health (Job 1:13–19; 2:7–8), leading to deep conversations with friends about suffering and God’s justice. Despite his pain, Job questions but never abandons God. In the end, God restores his fortunes and honors his steadfastness (Job 42:10–17), teaching lessons about patience, trust, and divine wisdom." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">3. Exodus</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Exodus records God’s deliverance of Israel from Egypt under Moses’ leadership (Exodus 3:10). It describes the ten plagues, the Passover (Exodus 12:1–30), and the miraculous crossing of the Red Sea (Exodus 14:21–31). God gives the Ten Commandments (Exodus 20:1–17) and instructions for worship. This book powerfully shows God’s saving power, covenant faithfulness, and desire to dwell among His people." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">4. Leviticus</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Leviticus focuses on laws, sacrifices, and holiness for God’s people. It details offerings (Leviticus 1–7), priestly duties (Leviticus 8–10), and purity laws (Leviticus 11–15). The call, “Be holy because I, the Lord your God, am holy” (Leviticus 19:2), runs throughout the book. Through its instructions, Leviticus emphasizes God’s presence and the need for obedience in every aspect of life." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">5. Numbers</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Numbers recounts Israel’s wilderness journey from Mount Sinai toward the promised land. It contains censuses (Numbers 1:1–46), accounts of rebellion (Numbers 14:1–45), and God’s continued guidance through a pillar of cloud and fire. Despite disobedience, God shows patience and keeps His promises. This book reveals both the cost of unbelief and the blessing of trust." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">6. Deuteronomy</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Deuteronomy records Moses’ final speeches to Israel before entering the promised land. He reviews their history, restates the law (Deuteronomy 5:1–33), and urges obedience and love for God (Deuteronomy 6:4–9). Moses warns against idolatry and stresses blessings for faithfulness. This book is both a farewell and a call to covenant loyalty." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">7. Joshua</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Joshua tells of Israel’s conquest of Canaan under Joshua’s leadership. God encourages him to be strong and courageous (Joshua 1:9). The book recounts victories at Jericho (Joshua 6:1–27) and other cities, division of the land, and renewal of the covenant. Joshua’s life shows how faith and obedience lead to God’s promises being fulfilled." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">8. Judges</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Judges covers Israel’s repeated cycle of sin, oppression, repentance, and deliverance. God raises leaders like Deborah (Judges 4:4–16), Gideon (Judges 6:11–40), and Samson (Judges 13–16). Each time the people turn away, God disciplines them, then rescues them when they cry out. The book highlights God’s mercy and the need for faithful leadership." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">9. Ruth</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Ruth tells a story of loyalty and redemption set during the time of the judges. After losing her husband, Ruth chooses to follow her mother-in-law Naomi and serve Naomi’s God (Ruth 1:16). She meets Boaz, a kinsman-redeemer, who marries her and secures her future. Ruth becomes part of the lineage of King David and ultimately Jesus Christ (Matthew 1:5)." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">10. 1 Samuel</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Samuel records Israel’s shift from judges to kings. It introduces Samuel, a prophet and leader, and recounts Israel’s demand for a king (1 Samuel 8:5–22). Saul becomes the first king but disobeys God, leading to his downfall. The book also tells of David’s rise—from defeating Goliath (1 Samuel 17:1–50) to becoming Saul’s successor—showing God’s choice and sovereignty in leadership." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">11. 2 Samuel</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Samuel continues David’s story as he becomes king over all Israel, uniting the nation and establishing Jerusalem as the capital (2 Samuel 5:3-5). It recounts his victories, the bringing of the ark to Jerusalem (2 Samuel 6:14-15), and God’s covenant with David promising an everlasting kingdom (2 Samuel 7:16). However, it also shows David’s sins, such as with Bathsheba (2 Samuel 11), and the consequences that followed. Through it all, God’s grace and justice are evident." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">12. 1 Kings</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="The book of 1 Kings begins with Solomon’s reign, his request for wisdom (1 Kings 3:9-12), and the building of the temple (1 Kings 6:14). Solomon’s later idolatry leads to the kingdom being divided after his death. The northern kingdom (Israel) and southern kingdom (Judah) follow, with many kings leading the people away from God. Prophets like Elijah confront false worship, showing God’s power and calling the nation back to Him." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">13. 2 Kings</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Kings continues the story of the divided kingdom, recording the ministries of Elisha, the reigns of many kings, and the fall of Israel to Assyria (2 Kings 17:6). Later, Judah falls to Babylon (2 Kings 25:8–12). The book shows that turning away from God leads to destruction, but He remains faithful to His promises." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">14. 1 Chronicles</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Chronicles focuses on David’s reign from a priestly perspective, beginning with genealogies that link Israel back to Adam (1 Chronicles 1:1–4). It highlights David’s preparations for the Temple, even though he would not build it, and encourages worship and obedience to God as central to national life." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">15. 2 Chronicles</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Chronicles continues with Solomon’s reign and the kings of Judah, describing the completion and dedication of the Temple (2 Chronicles 7:1–3). The book emphasizes seeking the Lord for blessing and deliverance and ends with Judah’s exile to Babylon, but also offers hope for return." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">16. Ezra</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Ezra tells of the return from Babylonian exile and the rebuilding of the Temple. The skilled teacher of the Law, leads spiritual renewal among the people (Ezra 7:10). The book shows how God stirs the hearts of leaders and people to restore true worship, teaching that God’s word brings life and strength to His people." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">17. Nehemiah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Nehemiah focuses on rebuilding Jerusalem’s walls despite opposition (Nehemiah 6:15–16) and leads spiritual reforms, calling the people to follow God’s commands. The book demonstrates the power of prayer, leadership, and perseverance in God’s work and ends with a renewed commitment to God’s covenant." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">18. Esther</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Esther is set in Persia and tells how a Jewish queen saves her people from destruction. With courage, Esther approaches the king to reveal Haman’s evil plan (Esther 7:3–6). Although God’s name is never mentioned, His providence is evident in every detail, showing that He works behind the scenes to protect His people." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">19. Psalms</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Psalms is a collection of 150 songs and prayers, including praise, thanksgiving, lament, and wisdom, written by David and others (Psalm 23:1–6, Psalm 46:1). The book teaches trust in God in every season of life and invites believers to pour out their hearts before the Lord." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">20. Proverbs</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Proverbs is a book of wise sayings and instructions for living, written mostly by Solomon. It teaches the value of wisdom, honesty, and hard work (Proverbs 1:7, Proverbs 3:5–6) through short, memorable statements that guide daily choices. The book shows that wisdom begins with the fear of the Lord." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">21. Ecclesiastes</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Ecclesiastes, written by Solomon, reflects on the meaning of life. It shows that wealth, pleasure, and human achievements are meaningless without God (Ecclesiastes 1:2, Ecclesiastes 2:11). The writer concludes that the best life is to fear God and keep His commandments (Ecclesiastes 12:13). It encourages seeking purpose in God rather than in temporary things." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">22. Song of Solomon</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Song of Solomon is a poetic book about love between a bride and groom. It celebrates the beauty of marriage and faithfulness (Song of Solomon 2:16, Song of Solomon 8:6–7). The imagery shows deep affection, commitment, and joy. It also reflects God’s love for His people." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">23. Isaiah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Isaiah contains prophecies of judgment and hope. It warns Judah of coming punishment but promises the coming of the Messiah (Isaiah 7:14, Isaiah 53:5–6). Isaiah speaks of God’s holiness, power, and salvation. It encourages trust in the Lord, who controls the nations." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">24. Jeremiah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Jeremiah, known as the “weeping prophet,” warned Judah about exile to Babylon (Jeremiah 25:11). He spoke of God’s call to repent and return to Him. The book also promises a new covenant where God’s law will be written on hearts (Jeremiah 31:33). It shows God’s mercy even in judgment." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">25. Lamentations</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Lamentations is a series of poems mourning Jerusalem’s destruction by Babylon. The writer grieves over the suffering but also remembers God’s faithfulness (Lamentations 3:22–23). It teaches that hope remains when we turn back to Him. The book encourages repentance and trust in God’s unfailing love." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">26. Ezekiel</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Ezekiel was a prophet during the Babylonian exile. He saw visions of God’s glory (Ezekiel 1:26–28) and delivered messages of judgment and restoration. The book speaks of a future new heart and spirit for God’s people (Ezekiel 36:26). It shows that God’s presence can be with His people anywhere." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">27. Daniel</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Daniel tells of a young man who stayed faithful in Babylon. He refused to eat the king’s food (Daniel 1:8) and prayed despite the threat of the lions’ den (Daniel 6:22). The book also contains visions of future kingdoms and God’s eternal reign. It teaches courage, prayer, and trust in God’s control." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">28. Hosea</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Hosea uses the prophet’s marriage to show God’s love for unfaithful Israel. Though Israel turned to idols, God called them back (Hosea 14:1–2). The book reveals His patient mercy and deep compassion. It reminds readers that God’s love never fails." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">29. Joel</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Joel warns of a locust plague as a picture of God’s coming judgment. He calls the people to repent and turn to the Lord (Joel 2:12–13). The book also promises God’s Spirit will be poured out on all people (Joel 2:28–29). It points to both warning and great hope." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">30. Amos</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Amos was a shepherd called to speak against Israel’s injustice. He condemned greed, oppression, and empty religion (Amos 5:24). The book shows that God cares about righteousness and mercy. It ends with a promise of restoration for His people." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">31. Obadiah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Obadiah is the shortest book in the Old Testament. It warns Edom of God’s judgment for mistreating Israel (Obadiah 1:10–12). The book promises that the Lord will defend His people and bring justice. It shows that pride leads to downfall, but God’s kingdom will stand forever." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">32. Jonah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Jonah tells of a prophet who tried to run from God’s call (Jonah 1:3). He was swallowed by a great fish and prayed from inside it (Jonah 2:1–2). Jonah eventually preached to Nineveh, and the people repented (Jonah 3:5). It shows God’s mercy toward all nations." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">33. Micah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Micah warns both Israel and Judah of coming judgment. He also speaks of a ruler who will be born in Bethlehem (Micah 5:2). The book highlights God’s desire for justice, mercy, and humility (Micah 6:8). It offers hope for restoration and peace." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">34. Nahum</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Nahum prophesies the fall of Nineveh, the capital of Assyria. It shows God as a refuge for those who trust Him (Nahum 1:7). The book reminds that God is patient but will judge evil. It’s a message of comfort for the oppressed." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">35. Habakkuk</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Habakkuk questions why God allows evil to prosper. God answers that the righteous will live by faith (Habakkuk 2:4). The book ends with a prayer of trust, even in hard times (Habakkuk 3:17–18). It teaches waiting on God’s timing with hope." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">36. Zephaniah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Zephaniah warns of the coming day of the Lord (Zephaniah 1:14–15). He calls for repentance and promises blessing for the humble. The book describes God’s future restoration of His people (Zephaniah 3:17). It urges turning to the Lord before judgment comes." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">37. Haggai</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Haggai encourages the people to rebuild the Temple after returning from exile (Haggai 1:8). He reminds them that God’s presence is more important than wealth or comfort. The book promises that the glory of the new Temple will be greater (Haggai 2:9). It shows the blessings of putting God first." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">38. Zechariah</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Zechariah encourages the people to keep rebuilding the Temple and to trust in God’s promises. It contains visions, prophecies of the Messiah, and calls to repentance (Zechariah 9:9, Zechariah 1:3). The book points to future hope when the Lord will reign over all the earth. It shows that God’s plans are certain and full of blessing." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">39. Malachi</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Malachi is the last book of the Old Testament. It addresses Israel’s neglect in worship and calls for faithfulness (Malachi 1:6–8). The book promises that the Messenger will prepare the way for the Lord (Malachi 3:1). It closes with hope, pointing toward the coming of Christ." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">40. Matthew</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Matthew presents Jesus as the Messiah and King. It begins with His genealogy and birth (Matthew 1:1–16, Matthew 1:21). The book includes the Sermon on the Mount (Matthew 5–7) and many miracles. It ends with the Great Commission to make disciples of all nations (Matthew 28:19–20)." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">41. Mark</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Mark is the shortest Gospel, focusing on Jesus’ actions and miracles. It shows Him as the Servant who came to give His life (Mark 10:45). The book moves quickly from one event to another, showing His authority over sickness, sin, and nature. It calls readers to follow Him with faith." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">42. Luke</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Luke presents Jesus as the Son of Man who cares for all people. It includes detailed accounts of His birth, teachings, and compassion (Luke 2:10–11, Luke 19:10). Luke emphasizes prayer, the Holy Spirit, and God’s mercy. It also highlights Jesus’ love for the poor and the outcast." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">43. John</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="John focuses on Jesus as the Son of God. It includes the famous verse about God’s love for the world (John 3:16). John uses signs and “I am” statements to show Jesus’ identity. It calls readers to believe in Him for eternal life." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">44. Acts</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Acts tells of the Holy Spirit’s work in the early church. It begins with Jesus’ ascension and the coming of the Spirit at Pentecost (Acts 2:1–4). The book records the spread of the Gospel through Peter, Paul, and others. It shows God’s power to change lives and grow His church." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">45. James</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="James teaches practical Christian living. It stresses doing what God’s word says, not only hearing it (James 1:22). The book speaks about controlling the tongue, showing mercy, and living by faith. It reminds believers that true faith produces good works." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">46. Galatians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Galatians defends the truth that salvation is by faith, not by works of the law (Galatians 2:16). Paul warns against false teachings and calls believers to live in the freedom of Christ. The book highlights the fruit of the Spirit (Galatians 5:22–23). It urges standing firm in the Gospel." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">47. 1 Thessalonians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Thessalonians encourages believers to stay strong in faith despite persecution. Paul reminds them of Jesus’ return (1 Thessalonians 4:16–17). He urges living holy and encouraging one another. It’s a letter full of hope and comfort." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">48. 2 Thessalonians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Thessalonians reassures the church about the day of the Lord. Paul corrects misunderstandings about Christ’s return and warns against idleness (2 Thessalonians 3:10). The book urges standing firm and holding to God’s truth. It offers encouragement in times of hardship." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">49. 1 Corinthians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Corinthians addresses problems in the church at Corinth, such as divisions, immorality, and misuse of spiritual gifts. Paul urges unity in Christ (1 Corinthians 1:10) and calls believers to live in holiness. He teaches about love as the greatest virtue (1 Corinthians 13:4–7) and the importance of the resurrection (1 Corinthians 15:3–4). The letter encourages building up the church and doing all things for God’s glory (1 Corinthians 10:31)." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">50. 2 Corinthians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Corinthians is a heartfelt letter in which Paul defends his ministry and shares about God’s comfort in trials (2 Corinthians 1:3–4). He encourages generous giving (2 Corinthians 9:6–7) and explains that believers are ambassadors for Christ (2 Corinthians 5:20). Paul also speaks about God’s strength being made perfect in weakness (2 Corinthians 12:9). The letter emphasizes living with integrity and relying fully on God." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">51. Romans</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Romans is Paul’s detailed explanation of the Gospel, showing that all have sinned (Romans 3:23) and are justified by faith in Christ (Romans 5:1). He teaches about grace, the role of the law, and life in the Spirit (Romans 8:1). Paul explains God’s plan for Israel and urges believers to live as living sacrifices (Romans 12:1–2). It is a powerful reminder of salvation through faith alone." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">52. Ephesians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Ephesians celebrates the blessings believers have in Christ, including redemption and adoption (Ephesians 1:7). Paul explains the unity of Jews and Gentiles in the church and the calling to live worthy of that unity (Ephesians 4:1–3). He teaches about putting on the armor of God (Ephesians 6:10–11) to stand firm against spiritual battles. The letter emphasizes grace, love, and the believer’s new life in Christ." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">53. Colossians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Colossians focuses on the supremacy of Christ, who is the image of the invisible God (Colossians 1:15–17). Paul warns against false teachings and urges setting hearts on things above (Colossians 3:1–2). He encourages living in love, forgiveness, and thankfulness. The book calls believers to let Christ’s peace rule in their hearts and to live for Him in all they do." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">54. Philemon</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Philemon is a personal letter from Paul to a believer named Philemon, asking him to forgive and welcome back his runaway slave, Onesimus, now a brother in Christ (Philemon 1:16). Paul appeals to love and Christian fellowship, offering to repay any wrong (Philemon 1:18–19). The letter highlights reconciliation and the transforming power of the Gospel in relationships." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">55. Philippians</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Philippians is a joyful letter encouraging believers to rejoice in the Lord always (Philippians 4:4). Paul thanks them for their partnership in the Gospel and urges unity, humility, and perseverance. He points to Christ’s humility as the ultimate example (Philippians 2:5–8) and assures that God will supply all their needs (Philippians 4:19). It is a message of hope, joy, and trust in every circumstance." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">56. 1 Timothy</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Timothy gives guidance to a young pastor on leading the church well. Paul stresses teaching sound doctrine (1 Timothy 4:13–16), caring for different groups in the congregation, and setting a godly example. He warns against false teachers and the love of money (1 Timothy 6:10–11). The letter encourages Timothy to fight the good fight of faith and remain faithful to his calling." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">57. Titus</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Titus contains instructions for appointing godly leaders and teaching sound doctrine (Titus 1:5–9). Paul urges believers to live self-controlled, upright, and godly lives (Titus 2:11–12). The letter emphasizes good works as evidence of faith and warns against divisive behavior. It shows that God’s grace teaches us to live in a way that honors Him." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">58. 2 Timothy</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Timothy is Paul’s final letter, written from prison. He urges Timothy to remain faithful to the Gospel (2 Timothy 1:8–9) and to preach the word in all seasons (2 Timothy 4:2). Paul warns of false teachings but reminds that Scripture equips believers for every good work (2 Timothy 3:16–17). It is a call to endurance and courage in ministry." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">59. Hebrews</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Hebrews presents Jesus as the ultimate High Priest and the fulfillment of the Old Testament sacrifices (Hebrews 4:14–16). It urges believers to hold fast to their faith and not drift away. The book explains how Christ’s sacrifice is once for all (Hebrews 10:10–12) and encourages perseverance by looking to Him (Hebrews 12:1–2). It is a rich reminder of the new covenant." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">60. 1 Peter</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 Peter encourages believers facing persecution to stand firm in their faith (1 Peter 1:6–7). Peter reminds them of their identity as God’s chosen people (1 Peter 2:9) and calls them to live holy lives. He points to Christ’s suffering as an example and assures that eternal glory awaits those who endure. The letter offers hope and strength in trials." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">61. 2 Peter</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 Peter warns against false teachers and urges spiritual growth (2 Peter 3:18). Peter reminds believers of God’s promises and the certainty of Christ’s return (2 Peter 3:9–10). He calls them to live in holiness and be diligent in their faith. The letter stresses the importance of remembering the truth of God’s word." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">62. Jude</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Jude warns against ungodly people who distort the faith (Jude 1:4). He calls believers to contend for the faith and keep themselves in God’s love (Jude 1:20–21). Jude encourages trusting in God, who is able to keep them from stumbling (Jude 1:24–25). It’s a short but urgent call to stay faithful." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">63. 1 John</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="1 John emphasizes love, truth, and assurance of salvation. John teaches that God is light (1 John 1:5) and love (1 John 4:8), calling believers to walk in both. He warns against false teachings and gives tests of genuine faith. The letter assures that eternal life is in Jesus (1 John 5:11–12)." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">64. 2 John</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="2 John is a brief letter warning against those who deny Christ came in the flesh (2 John 1:7). It urges walking in truth and love (2 John 1:6). John advises not to support false teachers and to remain faithful to the truth." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">65. 3 John</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="3 John commends a believer named Gaius for showing hospitality to traveling ministers (3 John 1:5–6). John warns against a man named Diotrephes who refused to welcome them. He encourages imitating what is good, not what is evil (3 John 1:11). The letter highlights the importance of love and support within the church." />
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4">66. Revelation</h3>
            <p className="text-muted-foreground leading-relaxed">
              <BibleLinkifiedText text="Revelation contains visions given to John about the end times, Christ’s victory, and the new heaven and earth (Revelation 21:1–4). It includes letters to seven churches, warnings, judgments, and the promise of Jesus’ return (Revelation 22:12–13). The book assures believers that God will defeat evil and that His people will dwell with Him forever. It is a message of hope, endurance, and worship." />
            </p>
          </section>

        </div>

        <h2 id="how-many-books-in-ot">How Many Books in the Old Testament?</h2>
        <p>
          The Old Testament contains 39 books. These books were written before the birth of Jesus Christ, during a time when God was forming and guiding the people of Israel. The Old Testament makes up about three-fourths of the Bible, and its stories, laws, and prophecies are deeply important for both Jews and Christians.
        </p>

        <Image
          src="/the-39-bible-books-of-the-old-testament.webp"
          alt="The 39 Bible Books of the Old Testament"
          width={1024}
          height={576}
          className="w-full h-auto rounded-none shadow-sm my-8"
        />

        <p>The books are traditionally grouped into four major sections:</p>
        <ul>
          <li><strong>The Law</strong> (Torah/Pentateuch) – Genesis, Exodus, Leviticus, Numbers, and Deuteronomy.</li>
          <li><strong>Historical Books</strong> – Joshua, Judges, Ruth, 1 &amp; 2 Samuel, Kings, Chronicles, Ezra, Nehemiah, and Esther.</li>
          <li><strong>Wisdom Writings and Poetry</strong> – Job, Psalms, Proverbs, Ecclesiastes, and Song of Solomon.</li>
          <li><strong>The Prophets</strong> – Isaiah, Jeremiah, Ezekiel, Daniel, and the twelve minor prophets.</li>
        </ul>

        <h2 id="old-testament">Old Testament Books (39 Books)</h2>
        <p>Here&apos;s the list of all 39 Old Testament books in canonical order, with their number of chapters:</p>

        <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {ot.map((book, i) => (
            <Link
              key={book.slug}
              href={`/bible/${book.slug}/`}
              className="flex items-center gap-3 rounded-none border border-border bg-card px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-secondary text-xs font-bold text-primary">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{book.name}</p>
                <p className="text-xs text-muted-foreground">{book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}</p>
              </div>
            </Link>
          ))}
        </div>


        <h2 id="how-many-books-in-nt">How Many Books in the New Testament?</h2>
        <p>
          The New Testament has 27 books, written after the birth, death, and resurrection of Jesus Christ. These books were completed in the 1st century A.D., by Jesus&apos; disciples and other early Christian leaders. They are the foundation of Christian faith and practice.
        </p>

        <Image
          src="/the-27-bible-books-of-the-new-testament.webp"
          alt="The 27 Bible Books of the New Testament"
          width={1024}
          height={576}
          className="w-full h-auto rounded-none shadow-sm my-8"
        />

        <p>The New Testament is organized into four key sections:</p>
        <ul>
          <li><strong>The Gospels</strong> – Matthew, Mark, Luke, and John.</li>
          <li><strong>Acts of the Apostles</strong> – The history of the early church.</li>
          <li><strong>The Epistles (Letters)</strong> – Romans through Jude.</li>
          <li><strong>Revelation</strong> – Prophetic vision of the end times.</li>
        </ul>

        <h2 id="new-testament">New Testament Books (27 Books)</h2>
        <p>Here are the 27 New Testament books listed with their chapter count:</p>

        <div className="not-prose grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {nt.map((book, i) => (
            <Link
              key={book.slug}
              href={`/bible/${book.slug}/`}
              className="flex items-center gap-3 rounded-none border border-border bg-card px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none bg-secondary text-xs font-bold text-primary">
                {i + 40}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{book.name}</p>
                <p className="text-xs text-muted-foreground">{book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}</p>
              </div>
            </Link>
          ))}
        </div>


        <h2 id="why-are-these-books-important">Why Are These Books Important?</h2>
        <p>
          The books of the Bible are more than just ancient texts. For Christians, they serve as a spiritual guide and a source of deep truth and direction. Every book carries a part of the message that helps people understand who God is, what He expects, and how to live a meaningful life.
        </p>
        <p>These books include:</p>
        <ul>
          <li><strong>Moral teachings</strong>: Lessons about right and wrong, such as the Ten Commandments or Jesus&apos; Sermon on the Mount.</li>
          <li><strong>Historical lessons</strong>: Real-life events from the past that show how God interacted with people and nations.</li>
          <li><strong>Prophetic insights</strong>: Messages from God delivered through prophets, revealing His plans and promises.</li>
          <li><strong>Hope, grace, and salvation</strong>: The Bible tells how God offers forgiveness through Jesus Christ.</li>
        </ul>

        <h2 id="how-are-these-books-used-today">How Are These Books Used Today?</h2>
        <p>
          Even though the Bible was written thousands of years ago, it continues to be used in daily life, worship, education, and personal growth.
        </p>
        <p>
          Churches use Bible passages during weekly sermons to teach and inspire their members. Many also host Bible study groups, where people read and discuss the meaning of different books or topics.
        </p>
        <p>
          Families often read from the Bible during daily devotionals or before meals. It helps them stay connected to their faith and to each other.
        </p>
        <p>
          Thanks to technology, the Bible is now more accessible than ever. There are many free Bible apps and websites that offer different translations. One of the trusted websites to read bible books, their chapters, verses, topical verses along with prayers is <strong>PrayerVerses.Com</strong>.
        </p>
        <p>
          Whether online or in print, in church or at home, the Bible remains a trusted and treasured source of truth for millions around the world.
        </p>
      </article>
    </>
  )
}
