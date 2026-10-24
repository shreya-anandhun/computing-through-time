/* =====================================================================
   data.js — all the exhibit content in one place.
   Milestones, the glossary (hover/tap definitions) and the quiz.
   Keeping content separate from behaviour means the timeline and quiz
   code never needs to change when a fact is edited.
   ===================================================================== */

/* Era keys used by the timeline filter buttons. */
const ERAS = {
  early:  { label: '1940–70',   test: (y) => y < 1970 },
  middle: { label: '1970–2000', test: (y) => y >= 1970 && y < 2000 },
  modern: { label: '2000+',     test: (y) => y >= 2000 },
};

/* Words wrapped in <dfn data-term="key"> get a tooltip from this list. */
const GLOSSARY = {
  'vacuum tube':     'Glass bulbs, a bit like old light bulbs, that could switch electricity on and off. They worked, but ran hot and burned out often.',
  'semiconductor':   'A material, like silicon, that conducts electricity only under certain conditions. That “sometimes” is exactly what makes it useful as a switch.',
  'silicon':         'The element most chips are made from. It is refined from ordinary sand, which is why the tech hub near San Francisco is called Silicon Valley.',
  'moore’s law':     'Gordon Moore noticed in 1965 that the number of transistors on a chip roughly doubles every two years. The trend held for about fifty years.',
  'packet':          'A small chunk of data. A message is split into packets, sent separately, and reassembled at the other end.',
  'internet protocol': 'The shared rules (called TCP/IP) that let any two computers on the internet understand each other, whoever made them.',
  'microprocessor':  'A complete processor, the part of a computer that does the actual calculating, squeezed onto a single chip.',
  'html':            'HyperText Markup Language: the code that describes what is on a web page, such as headings, paragraphs, links and images.',
  'http':            'HyperText Transfer Protocol: the rules a browser follows to ask a server for a page and get it back.',
  'server':          'A computer whose job is to send data to other computers over a network. Every website lives on a server somewhere.',
  'data centre':     'A warehouse full of servers with its own power and cooling. “The cloud” is thousands of these buildings.',
  'multi-touch':     'A screen that can sense several fingers at once, which is what makes pinching to zoom possible.',
  'large language model': 'An AI trained on enormous amounts of text to predict the next word. Do that well enough and it can answer questions, write and chat.',
  'compiler':        'A program that translates human-readable code into the instructions a computer can actually run.',
  'enigma':          'The encryption machine German forces used in the Second World War to scramble their messages.',
  'bug':             'A mistake in a program. The word is older than computers, but Grace Hopper’s team made it famous.',
  'machine code':    'The raw numbers a processor understands directly. Writing it by hand is slow and very easy to get wrong.',
};

/* Each milestone: year, era, title, teaser (shown collapsed), why it
   mattered (60–100 words, shown when expanded), a Did-you-know fact and
   an original SVG icon. <dfn> tags inside the text get glossary tooltips. */
const MILESTONES = [
  {
    id: 'eniac', year: 1945, era: 'early',
    title: 'ENIAC, the first room-sized brain',
    teaser: 'A computer the size of a flat, programmed with cables.',
    why: 'Before ENIAC, “computer” was a job title: people, usually women, worked through long calculations by hand. ENIAC, built at the University of Pennsylvania for the US Army, did the same maths with electricity instead of pencils. Its 17,000-plus <dfn data-term="vacuum tube">vacuum tubes</dfn> could add 5,000 numbers a second, which sounds slow today but was thousands of times faster than anything before it. It proved a wild idea: one general machine could be set up to solve many different problems. Every computer since is a descendant of that idea.',
    fact: 'ENIAC had no keyboard and no screen. To give it a new problem, its six programmers rewired it by hand using thousands of cables and switches, a job that could take days.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="6" width="48" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><g fill="currentColor"><circle cx="20" cy="18" r="3"/><circle cx="32" cy="18" r="3"/><circle cx="44" cy="18" r="3"/><circle cx="20" cy="30" r="3"/><circle cx="32" cy="30" r="3"/><circle cx="44" cy="30" r="3"/></g><path d="M16 44h32M16 50h20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'transistor', year: 1947, era: 'early',
    title: 'The transistor, a switch with no moving parts',
    teaser: 'Three scientists at Bell Labs shrink the future.',
    why: 'ENIAC’s vacuum tubes were hot, fragile and burned out constantly. In December 1947, John Bardeen and Walter Brattain, working under William Shockley at Bell Labs, built a tiny <dfn data-term="semiconductor">semiconductor</dfn> device that could switch and amplify an electrical signal with no glass, no heat and no moving parts. That device, the transistor, is the basic building block of every computer, phone and games console you have ever touched. Shrinking it, and packing more of them together, is the whole story of computing since.',
    fact: 'The chip inside a recent flagship phone holds around 19 billion transistors. The very first one was roughly the size of your fingertip.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="3"/><path d="M24 22v16M24 30h10M34 30l8-8M34 30l8 8M42 38l-3-1M22 48v10M32 48v10M42 48v10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`
  },
  {
    id: 'chip', year: 1958, era: 'early',
    title: 'The integrated circuit, a whole circuit on one chip',
    teaser: 'Why stop at one transistor per part?',
    why: 'Transistors solved one problem and created another: a useful circuit needed thousands of them, each soldered by hand. In 1958, Jack Kilby at Texas Instruments showed that transistors, resistors and the wires between them could all be made from a single piece of <dfn data-term="semiconductor">semiconductor</dfn>. Robert Noyce at Fairchild found a neater way to do it in <dfn data-term="silicon">silicon</dfn> months later. The microchip meant circuits could be printed rather than assembled, so they got smaller, cheaper and more reliable every year, a trend known as <dfn data-term="moore’s law">Moore’s law</dfn>.',
    fact: 'Kilby built his first chip during the summer holidays. As a new employee he had no leave yet, so he had the lab almost to himself.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="16" width="32" height="32" rx="5" fill="none" stroke="currentColor" stroke-width="3"/><rect x="26" y="26" width="12" height="12" rx="2" fill="currentColor"/><path d="M22 8v8M32 8v8M42 8v8M22 48v8M32 48v8M42 48v8M8 22h8M8 32h8M8 42h8M48 22h8M48 32h8M48 42h8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'arpanet', year: 1969, era: 'early',
    title: 'ARPANET, the internet’s first word',
    teaser: 'Two computers 500 km apart say hello. Sort of.',
    why: 'Computers were lonely machines until a US research project called ARPANET linked them together. Instead of one wire between two machines, it chopped messages into <dfn data-term="packet">packets</dfn> that could take any route and be reassembled at the other end, so the network kept working even if a link failed. On 29 October 1969 a computer at UCLA sent the first message to one at Stanford. The rules ARPANET pioneered grew into the <dfn data-term="internet protocol">internet protocols</dfn> that carry everything from this page to your group chats.',
    fact: 'The first message was meant to be “LOGIN”. The system crashed after two letters, so the internet’s first ever word was “LO”.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="14" cy="18" r="6"/><circle cx="50" cy="18" r="6"/><circle cx="14" cy="46" r="6"/><circle cx="50" cy="46" r="6"/><circle cx="32" cy="32" r="7"/><path d="M19 22l8 6M45 22l-8 6M19 42l8-6M45 42l-8-6"/></g></svg>`
  },
  {
    id: 'intel4004', year: 1971, era: 'middle',
    title: 'Intel 4004, a computer on a fingernail',
    teaser: 'The first microprocessor was built for a calculator.',
    why: 'A Japanese calculator company asked Intel for a set of custom chips. Instead, a small team led by Federico Faggin, with Ted Hoff and Stan Mazor, designed one general-purpose chip that could be programmed to do the calculator’s job, or almost any other job. The Intel 4004 held 2,300 transistors and was the first <dfn data-term="microprocessor">microprocessor</dfn> anyone could buy. It put a complete processor on a single chip, which is what made small, affordable computers possible at all.',
    fact: 'The calculator company, Busicom, originally owned the rights to the 4004. Intel bought them back for about $60,000, one of the best deals in tech history.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="14" y="20" width="36" height="24" rx="4" fill="none" stroke="currentColor" stroke-width="3"/><text x="32" y="37" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor" font-family="inherit">4004</text><path d="M20 12v8M28 12v8M36 12v8M44 12v8M20 44v8M28 44v8M36 44v8M44 44v8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'apple2', year: 1977, era: 'middle',
    title: 'The personal computer comes home',
    teaser: 'A computer for the kitchen table, not the lab.',
    why: 'Until the mid-1970s computers belonged to companies, universities and the military. The Apple II, designed almost entirely by Steve Wozniak, arrived in 1977 as a finished product in a plastic case: plug it into a TV, switch it on and type. It showed colour graphics, played sounds and, crucially, ran software written by other people. When VisiCalc, the first spreadsheet, appeared in 1979, ordinary businesses bought Apple IIs just to run it. Computing had become something you could own.',
    fact: '1977 was such a big year that three home computers launched at once: the Apple II, the Commodore PET and the Tandy TRS-80. Magazines called them the “1977 trinity”.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="10" width="36" height="26" rx="4"/><path d="M8 48h48a0 0 0 0 1 0 0v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z"/><path d="M20 42h24M16 36l-4 12M48 36l4 12"/></g><path d="M22 18h8M22 24h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'www', year: 1991, era: 'middle',
    title: 'The World Wide Web, the internet gets pages',
    teaser: 'One physicist’s side project at CERN.',
    why: 'The internet existed for twenty years before most people cared, because using it meant typing commands. Tim Berners-Lee, a scientist at CERN, wanted researchers to share documents easily, so he invented three things that work together: <dfn data-term="html">HTML</dfn> to write pages, <dfn data-term="http">HTTP</dfn> to fetch them and the web address (URL) to find them. The first website went live in 1991. In 1993 CERN made the technology free for anyone, which is why the web spread everywhere instead of belonging to one company.',
    fact: 'The very first website is still online at info.cern.ch. It is a plain text page explaining what the web is and how to use it.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="32" cy="32" r="22"/><ellipse cx="32" cy="32" rx="9" ry="22"/><path d="M10 32h44M14 21h36M14 43h36"/></g></svg>`
  },
  {
    id: 'cloud', year: 2006, era: 'modern',
    title: 'The cloud, renting computers by the hour',
    teaser: 'Your files live in somebody else’s building.',
    why: 'Running a website used to mean buying your own <dfn data-term="server">servers</dfn> and guessing how many you would need. In 2006 Amazon began renting out its spare computing power over the internet: storage first, then whole virtual machines, billed by the hour. Suddenly a student with a laptop could launch an app that scaled to millions of users without owning a single machine. Google and Microsoft followed. Today most apps, games and streaming services run in huge rented <dfn data-term="data centre">data centres</dfn>, which is all “the cloud” really is.',
    fact: 'Netflix, one of the biggest streaming services in the world, runs on Amazon’s cloud, even though Amazon’s own Prime Video is a direct competitor.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M20 46a10 10 0 0 1-1-20 14 14 0 0 1 27-3 9 9 0 0 1 2 23z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M24 36h16M24 41h10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`
  },
  {
    id: 'iphone', year: 2007, era: 'modern',
    title: 'The smartphone, the computer in your pocket',
    teaser: 'Steve Jobs holds up a phone with no keyboard.',
    why: 'Phones could already browse the web in 2007, badly, with tiny keys and a stylus. The iPhone replaced all of that with a single <dfn data-term="multi-touch">multi-touch</dfn> glass screen you could pinch, swipe and tap. A year later the App Store let anyone sell software for it, and the phone became a camera, map, wallet and games console. Android phones followed quickly and made the idea affordable worldwide. For most people on Earth, their first and main computer is now a smartphone.',
    fact: 'Apple did not own the name “iPhone” when Steve Jobs announced it. Cisco did, and already sold a product called that. The two companies settled a lawsuit a month later.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="20" y="6" width="24" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M28 12h8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="50" r="2.5" fill="currentColor"/><rect x="25" y="18" width="14" height="24" rx="2" fill="currentColor" opacity=".25"/></svg>`
  },
  {
    id: 'chatgpt', year: 2022, era: 'modern',
    title: 'Generative AI, computers that talk back',
    teaser: 'A chatbot hits 100 million users in two months.',
    why: 'For decades computers did exactly what they were told, no more. In November 2022 OpenAI released ChatGPT, a <dfn data-term="large language model">large language model</dfn> trained on vast amounts of text that could write essays, explain code and hold a conversation. It reached 100 million users faster than any app before it. Similar systems now generate images, music and video, and help write software, including parts of this site. Whether any of that counts as “thinking” is a question Alan Turing asked in 1950, and we are still arguing about it.',
    fact: 'The “T” in GPT stands for “transformer”, a design published by Google researchers in 2017 in a paper called “Attention Is All You Need”. It has nothing to do with the 1947 transistor.',
    icon: `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M12 14a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6H28l-10 9v-9h0a6 6 0 0 1-6-6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><g fill="currentColor"><circle cx="24" cy="25" r="3"/><circle cx="32" cy="25" r="3"/><circle cx="40" cy="25" r="3"/></g></svg>`
  },
];

/* Quiz: five multiple-choice questions, each with a short fact shown
   straight after answering. `answer` is the index of the correct option. */
const QUIZ = [
  {
    q: 'How did programmers give ENIAC a new problem to solve?',
    options: ['Typing it on a keyboard', 'Rewiring it with cables and switches', 'Speaking into a microphone', 'Loading a floppy disk'],
    answer: 1,
    fact: 'Six women did that rewiring: Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Meltzer, Fran Bilas and Ruth Lichterman. They were barely credited for decades.',
  },
  {
    q: 'What was the first message ever sent over ARPANET in 1969?',
    options: ['HELLO', 'LO', 'TEST', 'HI THERE'],
    answer: 1,
    fact: 'It was supposed to say LOGIN. The receiving computer crashed after the first two letters, and nobody has let the internet forget it.',
  },
  {
    q: 'Who invented the World Wide Web?',
    options: ['Bill Gates', 'Steve Jobs', 'Tim Berners-Lee', 'Alan Turing'],
    answer: 2,
    fact: 'He built it at CERN in Switzerland. In 1993 CERN gave the technology away for free, which is the main reason the web belongs to everyone.',
  },
  {
    q: 'The Intel 4004, the first microprocessor, was originally designed for what?',
    options: ['A games console', 'A pocket calculator', 'A space rocket', 'A washing machine'],
    answer: 1,
    fact: 'A Japanese company called Busicom ordered it for a calculator. Intel realised a programmable chip could do far more than add up and bought the rights back.',
  },
  {
    q: 'Grace Hopper is best known for inventing which of these?',
    options: ['The transistor', 'The first compiler', 'The smartphone', 'The Turing test'],
    answer: 1,
    fact: 'Her compiler let people program in English-like words instead of raw numbers. The “computer bug” moth her team found in 1947 is in the Smithsonian museum.',
  },
];
