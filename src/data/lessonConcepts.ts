export interface ConceptBreakdown {
  term: string;
  definition: string;
  badge?: string;
}

export interface TeachingConcept {
  summary: string;
  keyRule: string;
  codeSnippet: string;
  codeLanguage: 'html' | 'css' | 'php' | 'python' | 'java' | 'cpp' | 'sql' | 'bash' | 'json' | string;
  previewHtml?: string;
  terminalOutput?: string;
  breakdown: ConceptBreakdown[];
  proTip: string;
  commonMistake: string;
}

export const LESSON_CONCEPTS: Record<string, TeachingConcept> = {
  // ==========================================
  // --- HTML MODULE (13 Lessons) ---
  // ==========================================

  'html-intro': {
    summary: 'HTML (HyperText Markup Language) is the blueprint of every website on the internet. It gives raw text meaning, creating structure with tags that tell the browser what is a heading, what is a paragraph, and what is an image. HTML provides the bones; CSS provides the skin and styling; JavaScript provides the brain and interactivity.',
    keyRule: 'HTML tags tell the browser what content means: <tagname>content</tagname>. Closing tags always use a forward slash: </tagname>.',
    codeSnippet: `<!DOCTYPE html>
<html>
  <body>
    <h1>Welcome to My Website</h1>
    <p>This is my very first webpage created with HTML!</p>
  </body>
</html>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left">
      <h1 class="text-xl font-bold text-gray-900 border-b pb-1 mb-2">Welcome to My Website</h1>
      <p class="text-sm text-gray-700">This is my very first webpage created with HTML!</p>
    </div>`,
    breakdown: [
      { term: 'HyperText', definition: 'Text linked together via hyperlinks across the web.', badge: 'Meaning' },
      { term: 'Markup Language', definition: 'A system of tags that annotate and format raw text.', badge: 'Format' },
      { term: '<tag> ... </tag>', definition: 'Opening and closing containers marking the start and finish of an element.', badge: 'Syntax' },
      { term: 'Role of HTML', definition: 'Provides the structure and content; CSS styles it; JS animates it.', badge: 'Architecture' }
    ],
    proTip: 'Every website in the world—from Google to Netflix—relies on HTML as its structural backbone.',
    commonMistake: 'Thinking HTML is a programming language. It is a Markup Language used to structure documents, not compute logic.'
  },

  'html-skeleton': {
    summary: 'Every modern HTML5 page follows a strict document hierarchy. It starts with the <!DOCTYPE html> declaration telling browsers to parse as modern HTML5, followed by the root <html> container, the <head> for metadata, and the <body> where all visible page content lives.',
    keyRule: '<!DOCTYPE html> goes at the very top • Visible content must always live inside the <body> tag.',
    codeSnippet: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My Portfolio</title>
  </head>
  <body>
    <h1>Visible Heading</h1>
    <p>All text, buttons, and images seen by humans belong inside the body!</p>
  </body>
</html>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left">
      <div class="bg-gray-100 p-2 rounded text-[11px] font-mono text-gray-500 mb-2 border border-gray-200">
        &lt;head&gt; metadata: Tab title = "My Portfolio" (invisible in page body)
      </div>
      <div class="border-2 border-dashed border-blue-400 p-3 rounded-lg bg-blue-50/50">
        <span class="text-[10px] font-bold uppercase text-blue-600 tracking-wider block mb-1">Inside &lt;body&gt; (Visible Content):</span>
        <h1 class="text-lg font-black text-gray-900">Visible Heading</h1>
        <p class="text-xs text-gray-700 mt-1">All text, buttons, and images seen by humans belong inside the body!</p>
      </div>
    </div>`,
    breakdown: [
      { term: '<!DOCTYPE html>', definition: 'Declares this document as standard HTML5 to the browser engine.', badge: 'DocType' },
      { term: '<html>', definition: 'The root container wrapping all elements on the entire page.', badge: 'Root' },
      { term: '<head>', definition: 'Holds machine-readable metadata, stylesheets, and page title (not rendered).', badge: 'Head' },
      { term: '<body>', definition: 'The canvas where all visible text, headings, images, and links must be placed.', badge: 'Body' }
    ],
    proTip: 'Never place visible content like <h1> or <p> inside the <head>. The <head> is strictly for browser metadata and scripts.',
    commonMistake: 'Forgetting the exclamation mark in <!DOCTYPE html> or omitting the DOCTYPE entirely.'
  },

  'html-headings': {
    summary: 'Headings create visual and semantic hierarchy in your document. HTML provides 6 levels of headings: <h1> (most important / main title) through <h6> (least important / sub-subheading). Search engines and screen readers use headings to understand page topics.',
    keyRule: 'Use exactly ONE <h1> per page for your main title. <h6> is the smallest, lowest-level heading.',
    codeSnippet: `<h1>Space Odyssey 2026</h1>
<h2>Mission Objectives</h2>
<p>Our spacecraft launched at dawn with four astronauts aboard.</p>
<h3>Crew Members</h3>
<p>Commander Sarah Vance leads the navigation team.</p>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg space-y-1 text-left">
      <h1 class="text-xl font-black text-gray-900 leading-tight">Space Odyssey 2026</h1>
      <h2 class="text-base font-bold text-gray-800 pt-1">Mission Objectives</h2>
      <p class="text-xs text-gray-600">Our spacecraft launched at dawn with four astronauts aboard.</p>
      <h3 class="text-sm font-semibold text-gray-800 pt-1">Crew Members</h3>
      <p class="text-xs text-gray-600">Commander Sarah Vance leads the navigation team.</p>
    </div>`,
    breakdown: [
      { term: '<h1>', definition: 'Main page heading. Browsers and search engines treat this with highest priority.', badge: 'Level 1' },
      { term: '<h2> & <h3>', definition: 'Subheadings for major sections and nested subtopics.', badge: 'Sub-levels' },
      { term: '<h6>', definition: 'The smallest and lowest-level heading in HTML.', badge: 'Level 6' }
    ],
    proTip: 'Do not use <h1> just to make text big. Use CSS to change text size; use heading tags to signify semantic importance.',
    commonMistake: 'Skipping heading levels (jumping from <h1> directly to <h4> without <h2> or <h3>).'
  },

  'html-paragraphs': {
    summary: 'Paragraphs (<p>) represent blocks of standard body text. To emphasize important text with bold styling, use the <strong> tag. To insert a line break without starting a whole new paragraph, use the self-closing <br> tag.',
    keyRule: '<p> wraps text blocks • <strong> makes text bold & important • <br> creates a single line break.',
    codeSnippet: `<p>Welcome to our online coding academy.</p>
<p>
  Learning HTML is <strong>essential</strong> for every web developer.<br>
  Start your journey with hands-on practice today!
</p>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg space-y-2 text-left text-xs">
      <p class="text-gray-800">Welcome to our online coding academy.</p>
      <p class="text-gray-800 border-t pt-1">
        Learning HTML is <strong class="text-gray-950 font-black">essential</strong> for every web developer.<br />
        <span class="text-gray-500 italic text-[11px]">(New line created via &lt;br&gt; without extra paragraph spacing)</span>
      </p>
    </div>`,
    breakdown: [
      { term: '<p>', definition: 'Paragraph element that automatically adds vertical margin above and below.', badge: 'Block' },
      { term: '<strong>', definition: 'Indicates strong importance, rendered bold by default.', badge: 'Semantic' },
      { term: '<br>', definition: 'Break tag that forces text onto a new line. Self-closing void element.', badge: 'Line Break' }
    ],
    proTip: 'Use <strong> rather than <b>. While both look bold, <strong> indicates semantic importance for screen readers.',
    commonMistake: 'Using multiple <br><br><br> tags to create spacing. Always use CSS margins or padding for layout spacing.'
  },

  'html-links': {
    summary: 'Hyperlinks are what make the "World Wide Web" a web. The <a> (anchor) tag creates a clickable link connecting pages, files, or external websites using the href (Hypertext Reference) attribute.',
    keyRule: '<a href="destination_url">Clickable Anchor Text</a> • target="_blank" opens in a new tab.',
    codeSnippet: `<a href="https://google.com" target="_blank">Search on Google ↗</a>
<br>
<a href="/contact.html">Contact Support Team</a>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg space-y-2 text-left">
      <a href="#" class="text-blue-600 underline font-semibold text-sm hover:text-blue-800 block">Search on Google ↗</a>
      <a href="#" class="text-indigo-600 underline font-semibold text-sm hover:text-indigo-800 block">Contact Support Team</a>
    </div>`,
    breakdown: [
      { term: '<a>', definition: 'Anchor tag that wraps text or images to turn them into clickable links.', badge: 'Tag' },
      { term: 'href="..."', definition: 'Hypertext REFerence attribute containing the URL or destination path.', badge: 'Required' },
      { term: 'target="_blank"', definition: 'Tells the browser to open the linked page in a fresh new tab.', badge: 'New Tab' }
    ],
    proTip: 'Always write descriptive link text. Instead of writing "Click here", write "Download our 2026 Web Roadmap (PDF)".',
    commonMistake: 'Leaving the href attribute empty or forgetting quotes: <a href=https://site.com>.'
  },

  'html-images': {
    summary: 'Images bring webpages to life. The <img> tag embeds pictures, graphics, and diagrams. It is a self-closing void tag, meaning it does not have a separate </img> closing tag. It requires a src attribute for the file URL and an alt attribute for accessibility.',
    keyRule: '<img src="image_path.jpg" alt="Description of the image"> • No closing </img> tag needed.',
    codeSnippet: `<img 
  src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=200" 
  alt="Microchip circuit board glowing with blue light"
  width="200"
/>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left">
      <div class="w-full h-24 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-inner">
        🖼️ [Microchip circuit board glowing with blue light]
      </div>
      <p class="text-[11px] text-gray-500 mt-1 italic">Rendered & accessible with screen reader alt text</p>
    </div>`,
    breakdown: [
      { term: 'src="..."', definition: 'Source attribute specifying the image file path or web URL.', badge: 'Source' },
      { term: 'alt="..."', definition: 'Alternative text read by screen readers and shown if image fails to load.', badge: 'Accessibility' },
      { term: 'Self-Closing', definition: 'Void tag that never requires a closing </img> tag.', badge: 'Void Element' }
    ],
    proTip: 'Never omit the alt attribute! It is critical for visually impaired users using screen readers and boosts Google SEO.',
    commonMistake: 'Attempting to write <img>Photo</img> with a closing tag.'
  },

  'html-lists': {
    summary: 'Lists organize related items into clear sequences. HTML gives you Unordered Lists (<ul>) for bulleted items and Ordered Lists (<ol>) for numbered steps. Each item inside is marked with <li> (List Item).',
    keyRule: '<ul> creates bulleted list • <ol> creates numbered list • <li> defines each list item.',
    codeSnippet: `<!-- Bulleted Unordered List -->
<ul>
  <li>HTML5 Structure</li>
  <li>CSS3 Styling</li>
  <li>JavaScript Interactivity</li>
</ul>

<!-- Numbered Ordered List -->
<ol>
  <li>Open Code Editor</li>
  <li>Write Markup</li>
  <li>Launch Browser</li>
</ol>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg grid grid-cols-2 gap-4 text-left text-xs">
      <div>
        <span class="font-bold text-gray-500 uppercase text-[10px] block mb-1">Bulleted (ul):</span>
        <ul class="list-disc list-inside space-y-1 text-gray-800">
          <li>HTML5 Structure</li>
          <li>CSS3 Styling</li>
          <li>JavaScript</li>
        </ul>
      </div>
      <div>
        <span class="font-bold text-gray-500 uppercase text-[10px] block mb-1">Numbered (ol):</span>
        <ol class="list-decimal list-inside space-y-1 text-gray-800">
          <li>Open Editor</li>
          <li>Write Markup</li>
          <li>Launch Page</li>
        </ol>
      </div>
    </div>`,
    breakdown: [
      { term: '<ul>', definition: 'Unordered list rendered with circular bullet points.', badge: 'Bulleted' },
      { term: '<ol>', definition: 'Ordered list rendered with sequential numbers (1, 2, 3...).', badge: 'Numbered' },
      { term: '<li>', definition: 'List item. Must only be placed inside <ul> or <ol> containers.', badge: 'Item' }
    ],
    proTip: 'Modern navigation menus (navbars) are almost always built with a <ul> wrapped inside a <nav> tag!',
    commonMistake: 'Putting plain text directly inside <ul> without wrapping each row in an <li>.'
  },

  'html-forms': {
    summary: 'Forms let websites collect data from users—emails, passwords, messages, and choices. The versatile <input> tag adapts its behavior based on the type attribute (e.g. type="text", type="password"), while <button type="submit"> sends the form to the server.',
    keyRule: '<input type="text"> for text • <input type="password"> masks characters • <button type="submit"> sends data.',
    codeSnippet: `<form action="/login" method="POST">
  <label for="username">Username:</label>
  <input type="text" id="username" placeholder="Type your username" required>

  <label for="pwd">Password:</label>
  <input type="password" id="pwd" placeholder="Enter password" required>

  <button type="submit">Sign In</button>
</form>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg space-y-2 text-left text-xs">
      <div>
        <label class="block font-bold text-gray-700 text-[10px] uppercase mb-0.5">Username:</label>
        <input type="text" placeholder="Type your username" class="w-full border border-gray-300 rounded px-2 py-1 text-xs" readonly />
      </div>
      <div>
        <label class="block font-bold text-gray-700 text-[10px] uppercase mb-0.5">Password:</label>
        <input type="password" value="secretpass" class="w-full border border-gray-300 rounded px-2 py-1 text-xs tracking-widest text-gray-600" readonly />
      </div>
      <button class="bg-blue-600 text-white font-bold px-3 py-1.5 rounded text-xs mt-1">Sign In</button>
    </div>`,
    breakdown: [
      { term: 'type="text"', definition: 'Standard single-line text input field.', badge: 'Text' },
      { term: 'type="password"', definition: 'Conceals typed characters with dots for sensitive security.', badge: 'Security' },
      { term: 'placeholder="..."', definition: 'Hint text visible inside input before user starts typing.', badge: 'Hint' },
      { term: '<button type="submit">', definition: 'Triggers the form submission event to send data.', badge: 'Submission' }
    ],
    proTip: 'Always pair every <input> with a matching <label> using the for and id attributes for accessibility.',
    commonMistake: 'Forgetting the type="password" attribute on password inputs, exposing confidential user passwords on screen.'
  },

  'html-tables': {
    summary: 'Tables display structured tabular data in rows and columns—like sports scores, pricing matrices, and inventory databases. <table> wraps <tr> (table rows), <th> (header cells), and <td> (data cells).',
    keyRule: '<table> wraps <tr> (row) • <th> represents a bold header cell • <td> is a regular data cell.',
    codeSnippet: `<table>
  <tr>
    <th>Student</th>
    <th>Score</th>
    <th>Grade</th>
  </tr>
  <tr>
    <td>Maya</td>
    <td>98%</td>
    <td>A+</td>
  </tr>
</table>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-xs text-left">
      <table class="w-full border-collapse border border-gray-200 text-left">
        <thead class="bg-gray-100 text-gray-700 font-bold text-[10px] uppercase">
          <tr>
            <th class="p-1.5 border border-gray-200">Student</th>
            <th class="p-1.5 border border-gray-200">Score</th>
            <th class="p-1.5 border border-gray-200">Grade</th>
          </tr>
        </thead>
        <tbody class="text-gray-800 text-[11px]">
          <tr>
            <td class="p-1.5 border border-gray-200 font-medium">Maya</td>
            <td class="p-1.5 border border-gray-200 text-emerald-600 font-bold">98%</td>
            <td class="p-1.5 border border-gray-200">A+</td>
          </tr>
        </tbody>
      </table>
    </div>`,
    breakdown: [
      { term: '<table>', definition: 'Container wrapper for all tabular rows and columns.', badge: 'Root' },
      { term: '<tr>', definition: 'Table Row holding cells horizontally across the table.', badge: 'Row' },
      { term: '<th>', definition: 'Table Header cell, automatically bolded and centered by default.', badge: 'Header Cell' },
      { term: '<td>', definition: 'Table Data cell holding individual values.', badge: 'Data Cell' }
    ],
    proTip: 'Never use <table> to layout webpage designs (a bad practice from the 1990s). Use CSS Grid or Flexbox for layout; use tables solely for data!',
    commonMistake: 'Putting <td> directly inside <table> without wrapping them inside a <tr>.'
  },

  'html-semantic': {
    summary: 'Semantic HTML tags describe their exact meaning to both browsers and search engines. Instead of using generic <div> for everything, semantic tags tell screen readers where the navigation, main article, and footer reside.',
    keyRule: 'Use <header>, <nav>, <main>, <article>, <aside>, and <footer> to structure your page.',
    codeSnippet: `<header>
  <h1>Tech Radar</h1>
  <nav><a href="/">Home</a> | <a href="/topics">Topics</a></nav>
</header>
<main>
  <article>
    <h2>Semantic Web Architecture</h2>
    <p>Articles are self-contained stories.</p>
  </article>
</main>
<footer>
  <p>&copy; 2026 CodeQuest Academy</p>
</footer>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-2.5 font-sans bg-white text-gray-900 rounded-lg space-y-1.5 text-xs text-left">
      <div class="bg-indigo-50 border border-indigo-200 p-1.5 rounded flex justify-between items-center text-[10px] text-indigo-700 font-bold">
        <span>&lt;header&gt; with &lt;nav&gt;</span>
        <span class="bg-indigo-200 px-1.5 py-0.5 rounded text-indigo-900">Home • Docs</span>
      </div>
      <div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[11px]">
        <strong class="text-emerald-900 block font-bold">&lt;main&gt; Article Content</strong>
        <p class="text-gray-600 text-[10px]">Self-contained story readable by search crawlers.</p>
      </div>
      <div class="bg-gray-100 p-1 rounded text-center text-[9px] text-gray-500 font-mono">
        &lt;footer&gt; &copy; 2026 CodeQuest
      </div>
    </div>`,
    breakdown: [
      { term: '<header>', definition: 'Top banner containing site logos, titles, and introductory nav.', badge: 'Top Banner' },
      { term: '<nav>', definition: 'Navigation section containing major menu links.', badge: 'Navigation' },
      { term: '<main>', definition: 'The unique primary content of this specific webpage (only one per page).', badge: 'Primary' },
      { term: '<footer>', definition: 'Bottom zone with copyrights, contact links, and legal disclaimers.', badge: 'Bottom' }
    ],
    proTip: 'Google crawler algorithms reward semantic HTML with higher ranking and rich snippet displays in search results.',
    commonMistake: 'Having more than one <main> element visible on the page.'
  },

  'html-media': {
    summary: 'HTML5 allows embedding rich multimedia directly into web pages without third-party plugins. Use <video controls> and <audio controls> with the controls attribute so users can play, pause, and adjust volume, or use <iframe> to embed external content like YouTube videos.',
    keyRule: '<video controls> adds playback buttons • <audio controls> adds audio player • <iframe> embeds external pages.',
    codeSnippet: `<!-- HTML5 Video Player -->
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support HTML video.
</video>

<!-- HTML5 Audio Player -->
<audio controls>
  <source src="podcast.mp3" type="audio/mpeg">
</audio>

<!-- Embedded Webpage / YouTube -->
<iframe src="https://example.com" width="300" height="150"></iframe>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg space-y-2 text-left text-xs">
      <div class="bg-gray-900 text-white p-3 rounded-lg flex items-center justify-between">
        <span class="font-mono text-xs">▶ Video Player with controls</span>
        <span class="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold">00:15 / 02:30</span>
      </div>
      <div class="bg-gray-100 p-2 rounded flex items-center gap-2 border border-gray-300">
        <span>🔊</span>
        <div class="h-2 flex-1 bg-gray-300 rounded-full overflow-hidden">
          <div class="w-1/3 h-full bg-blue-600"></div>
        </div>
        <span class="text-[10px] text-gray-500 font-mono">&lt;audio controls&gt;</span>
      </div>
    </div>`,
    breakdown: [
      { term: '<video controls>', definition: 'Embeds video with built-in play, pause, scrubber, and volume controls.', badge: 'Video' },
      { term: '<audio controls>', definition: 'Embeds sound tracks, podcasts, and audio clips with playback controls.', badge: 'Audio' },
      { term: '<source src="..."', definition: 'Specifies alternative media formats for cross-browser playback.', badge: 'Media Source' },
      { term: '<iframe>', definition: 'Inline frame that embeds an external webpage or interactive widget.', badge: 'Embed' }
    ],
    proTip: 'Always include the controls attribute on <video> and <audio>; without it, visitors will have no way to start or stop playback!',
    commonMistake: 'Forgetting the controls attribute, resulting in an invisible or unplayable media element.'
  },

  'html-metadata': {
    summary: 'The <head> element contains machine-readable metadata that is not visible on the webpage canvas, but configures page titles, character encodings, viewport responsiveness, and SEO preview cards.',
    keyRule: '<title> sets tab title • <meta charset="UTF-8"> enables characters/emojis • <link rel="stylesheet"> links CSS.',
    codeSnippet: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeQuest Academy | Master HTML</title>
  <link rel="stylesheet" href="style.css">
</head>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left text-xs">
      <div class="bg-gray-100 border border-gray-300 rounded p-2 flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
        <span class="text-[11px] font-bold text-gray-700 ml-2">🌐 Tab: CodeQuest Academy | Master HTML</span>
      </div>
      <p class="text-[10px] text-gray-500 mt-2">The &lt;title&gt; controls browser tab text, bookmarks, and search result titles!</p>
    </div>`,
    breakdown: [
      { term: '<title>', definition: 'Sets the title displayed on browser tabs and search engine search results.', badge: 'Browser Tab' },
      { term: '<meta charset="UTF-8">', definition: 'Enables support for universal international characters and emojis.', badge: 'Encoding' },
      { term: 'viewport meta', definition: 'Ensures the webpage scales properly across smartphones and tablets.', badge: 'Mobile Ready' },
      { term: '<link rel="stylesheet">', definition: 'Attaches external CSS stylesheets to style the HTML elements.', badge: 'Style Link' }
    ],
    proTip: 'Always include the viewport meta tag; without it, mobile devices will render your website like a tiny desktop view.',
    commonMistake: 'Placing <h1> or visible body tags inside the <head>.'
  },

  'html-boss': {
    summary: 'The Developer Capstone combines every HTML concept into a cohesive web structure. You will apply semantic containers, forms, tables, media, and navigation links in a master challenge!',
    keyRule: 'Combine <header>, <nav>, <main>, <section>, <form>, and <footer> in clean hierarchy.',
    codeSnippet: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Portfolio Boss</title>
  </head>
  <body>
    <header><nav><a href="#skills">Skills</a></nav></header>
    <main>
      <h1>Fullstack Engineer</h1>
      <img src="avatar.jpg" alt="Profile avatar" />
    </main>
    <footer>&copy; 2026</footer>
  </body>
</html>`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left text-xs space-y-1">
      <div class="flex items-center justify-between border-b pb-1 font-bold text-blue-600">
        <span>🏆 Capstone Master Website</span>
        <span class="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">Boss Challenge</span>
      </div>
      <p class="text-gray-600 text-[11px]">Synthesize markup, hierarchy, accessibility, and modern HTML5 semantics.</p>
    </div>`,
    breakdown: [
      { term: 'Full Hierarchy', definition: 'Proper nesting from <!DOCTYPE html> down through footer.', badge: 'Capstone' },
      { term: 'Accessible Media', definition: 'Images with alt descriptions, form inputs with labels.', badge: 'Best Practice' }
    ],
    proTip: 'Take your time to read each question carefully. You are proving your full mastery of HTML foundation!',
    commonMistake: 'Rushing without checking closing tags or attribute syntax.'
  },

  // ==========================================
  // --- CSS MODULE (9 Lessons) ---
  // ==========================================

  'css-colors': {
    summary: 'CSS (Cascading Style Sheets) brings color, life, and style to plain HTML. The color property controls text color, while background-color fills the element background.',
    keyRule: 'color: blue changes text color • background-color: #0f172a changes container background.',
    codeSnippet: `/* CSS Rule Structure */
h1 {
  color: blue;                /* Sets text color */
  background-color: #0f172a;  /* Sets background */
}

p {
  color: rgb(255, 99, 71);    /* Tomato red RGB value */
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-4 rounded-xl text-left" style="background-color: #0f172a;">
      <h1 class="text-base font-black text-blue-400">Electric Blue Heading</h1>
      <p class="text-xs mt-1" style="color: rgb(255, 180, 160);">Warm coral paragraph text with custom CSS color values.</p>
    </div>`,
    breakdown: [
      { term: 'color', definition: 'Specifies the foreground color of text and inline SVG icons.', badge: 'Text Color' },
      { term: 'background-color', definition: 'Fills the container background with a color or transparent tint.', badge: 'Background' },
      { term: 'Hex (#38bdf8)', definition: 'Hexadecimal color representation (#RRGGBB).', badge: 'Hex Code' },
      { term: 'rgb(...) / rgba(...)', definition: 'Red, Green, Blue color channels with optional Alpha opacity.', badge: 'RGB / Alpha' }
    ],
    proTip: 'Always check contrast ratios between text color and background color to keep text easy to read for all users.',
    commonMistake: 'Writing background-color: "red" with quotes. CSS values never use quotation marks around color names or hex codes.'
  },

  'css-box-model': {
    summary: 'Every HTML element on a webpage is a rectangular box. The CSS Box Model consists of four concentric layers: Content (innermost), Padding (inner breathing room), Border (frame), and Margin (outer spacing between elements).',
    keyRule: 'padding is inner space inside the border • margin is outer space outside the border.',
    codeSnippet: `.card {
  padding: 16px;            /* Inside space between text and border */
  border: 2px solid #3b82f6;/* Visible outline frame */
  margin: 20px;             /* Outside space separating neighboring cards */
  box-sizing: border-box;   /* Keeps padding inside width */
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 bg-gray-900 text-white rounded-xl text-left text-xs">
      <div class="border-2 border-dashed border-amber-400 bg-amber-500/10 p-2 rounded text-center">
        <span class="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-1">Margin (Outer Space)</span>
        <div class="border-2 border-solid border-sky-400 bg-sky-500/20 p-2 rounded">
          <span class="text-[10px] text-sky-300 font-bold uppercase tracking-wider block mb-1">Border & Padding</span>
          <div class="bg-blue-600 text-white p-2 rounded font-bold text-center text-xs">
            Content Box (Text / Image)
          </div>
        </div>
      </div>
    </div>`,
    breakdown: [
      { term: 'Content', definition: 'The actual text, image, or button inside the box.', badge: 'Core' },
      { term: 'Padding', definition: 'Clear space around the content, inside the border.', badge: 'Internal' },
      { term: 'Border', definition: 'A line encircling the padding and content.', badge: 'Outline' },
      { term: 'Margin', definition: 'Clear space outside the border separating this element from neighboring elements.', badge: 'External' }
    ],
    proTip: 'Always add * { box-sizing: border-box; } to your CSS so that adding padding does not accidentally make elements wider than intended!',
    commonMistake: 'Confusing padding (inside space) with margin (outside space).'
  },

  'css-selectors': {
    summary: 'Selectors determine which HTML elements your CSS styling rules apply to. You target elements with Tag selectors, reusable classes (.class-name), or unique IDs (#id-name).',
    keyRule: 'Class selector starts with dot (.) • ID selector starts with hash (#) • Descendant selector (.container p).',
    codeSnippet: `/* Tag Selector (All paragraphs) */
p { font-size: 16px; }

/* Class Selector (Reusable anywhere with class="btn") */
.btn { background-color: blue; }

/* ID Selector (Unique single element with id="header") */
#header { background-color: #1e293b; }

/* Descendant Selector: All <p> inside elements with class="container" */
.container p { color: gray; }`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left text-xs space-y-2">
      <p class="text-gray-800">Standard &lt;p&gt; tag selector.</p>
      <div class="bg-yellow-200 text-yellow-950 p-1.5 rounded font-semibold">.btn class selector applied here!</div>
      <div class="bg-slate-800 text-white p-1.5 rounded font-mono text-[11px]">#header unique ID selector</div>
    </div>`,
    breakdown: [
      { term: '.class', definition: 'Prefixed with a dot (.). Reusable across multiple elements.', badge: 'Preferred' },
      { term: '#id', definition: 'Prefixed with a hash (#). Targets a single unique element with matching id.', badge: 'Unique' },
      { term: '.parent child', definition: 'Descendant selector targeting child elements inside parent.', badge: 'Descendant' },
      { term: 'Specificity', definition: 'IDs override classes, which override general tag selectors.', badge: 'Cascade' }
    ],
    proTip: 'Prefer classes (.badge, .card) over IDs (#header) for styling. Classes are reusable and keep your CSS easy to maintain.',
    commonMistake: 'Writing class="btn" in HTML but forgetting the leading dot in CSS (.btn).'
  },

  'css-typography': {
    summary: 'Typography controls how text looks and reads. You control character size (font-size), weight/boldness (font-weight), font family (font-family), and relative scaling with rem units.',
    keyRule: 'font-size sets scale • font-weight sets thickness (bold) • rem is relative to root font size.',
    codeSnippet: `.article-title {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: bold;        /* Bold thickness */
  line-height: 1.4;
}

/* Using modern relative rem units */
.subheading {
  font-size: 1.5rem;        /* 1.5x root HTML font size */
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-center space-y-1">
      <h3 class="text-xl font-extrabold text-gray-900">Modern Typography</h3>
      <p class="text-xs text-gray-600 leading-relaxed font-medium">Clear font-size and font-weight make web text effortless to scan.</p>
    </div>`,
    breakdown: [
      { term: 'font-size', definition: 'Size of characters (e.g. 24px, 1.5rem, 2em).', badge: 'Size' },
      { term: 'font-weight', definition: 'Thickness: normal, bold, 400 (regular), 700 (bold), 900 (black).', badge: 'Weight' },
      { term: 'rem unit', definition: 'Relative unit based on the font-size of the root <html> element (usually 16px).', badge: 'Relative Unit' },
      { term: 'line-height', definition: 'Vertical spacing between lines of wrapped text.', badge: 'Readability' }
    ],
    proTip: 'Use rem units instead of raw px for font-size so your text automatically scales if the user increases system text size.',
    commonMistake: 'Setting text-align: middle instead of text-align: center (middle is for vertical-align).'
  },

  'css-display': {
    summary: 'The display property is the master switch of CSS layout. It dictates whether an element starts on a new line (block), flows alongside text (inline), or allows width/height while sitting side-by-side (inline-block). Positioning allows overlaying with relative and absolute.',
    keyRule: 'inline-block allows width & height while flowing inline • absolute positions relative to nearest positioned ancestor.',
    codeSnippet: `.nav-item {
  display: inline-block;    /* Sits side-by-side but accepts width/height/padding */
  width: 120px;
  padding: 8px;
}

.parent {
  position: relative;       /* Anchor for absolute children */
}
.overlay-badge {
  position: absolute;       /* Positions relative to .parent */
  top: 0;
  right: 0;
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left text-xs space-y-2">
      <div class="relative bg-slate-900 text-white p-3 rounded-lg">
        <span class="absolute top-1 right-1 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">top: 0; right: 0;</span>
        <div class="space-x-2 mt-2">
          <span class="bg-blue-600 text-white px-2 py-1 rounded inline-block font-semibold">inline-block 1</span>
          <span class="bg-blue-600 text-white px-2 py-1 rounded inline-block font-semibold">inline-block 2</span>
        </div>
      </div>
    </div>`,
    breakdown: [
      { term: 'block', definition: 'Takes full width available and begins on a fresh line.', badge: 'Block' },
      { term: 'inline-block', definition: 'Flows inline like words, but respects width, height, and margins.', badge: 'Hybrid' },
      { term: 'position: absolute', definition: 'Positions an element precisely relative to its nearest positioned ancestor.', badge: 'Overlay' },
      { term: 'position: relative', definition: 'Remains in document flow but acts as an anchor coordinate for absolute children.', badge: 'Anchor' }
    ],
    proTip: 'When using position: absolute on a child, always give the parent container position: relative so the child stays inside the parent!',
    commonMistake: 'Trying to set width and height on an inline element like <span> without setting display: inline-block.'
  },

  'css-flexbox': {
    summary: 'Flexbox (Flexible Box Layout) is the modern standard for aligning elements horizontally or vertically. Applying display: flex to a parent container instantly unlocks superpowers to distribute, align, and center items.',
    keyRule: 'display: flex creates container • justify-content aligns main axis (horiz) • align-items aligns cross axis (vert) • gap sets spacing.',
    codeSnippet: `.navbar {
  display: flex;
  justify-content: center;      /* Center items horizontally along main axis */
  align-items: center;          /* Align items along cross axis (vertically) */
  gap: 16px;                    /* Clean 16px space between all child items */
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-slate-900 text-white rounded-lg">
      <div class="flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700">
        <span class="font-bold text-sky-400 text-xs">🚀 Logo</span>
        <div class="flex gap-2 text-[10px]">
          <span class="bg-slate-700 px-2 py-0.5 rounded">Courses</span>
          <span class="bg-blue-600 px-2 py-0.5 rounded font-bold">Sign In</span>
        </div>
      </div>
      <p class="text-[10px] text-gray-400 mt-1.5 text-center">display: flex with gap: 16px in action</p>
    </div>`,
    breakdown: [
      { term: 'display: flex', definition: 'Activates flexbox context for all direct children of this container.', badge: 'Container' },
      { term: 'justify-content', definition: 'Aligns items along main axis (flex-start, center, flex-end, space-between).', badge: 'Main Axis' },
      { term: 'align-items', definition: 'Aligns items along cross axis (vertically) like center or flex-start.', badge: 'Cross Axis' },
      { term: 'gap', definition: 'Modern spacing property setting equal space between child items without margins.', badge: 'Spacing' }
    ],
    proTip: 'Centering a div perfectly is as simple as: display: flex; justify-content: center; align-items: center; (just 3 lines!).',
    commonMistake: 'Applying justify-content or align-items to the child element instead of the parent container.'
  },

  'css-grid': {
    summary: 'CSS Grid is a 2-dimensional layout system that manages BOTH rows and columns simultaneously. While Flexbox is 1-dimensional (laying items in a single row or column), Grid gives you full control over two-dimensional page layouts, photo galleries, and card decks.',
    keyRule: 'display: grid • grid-template-columns: repeat(3, 1fr) creates 3 equal columns • Grid is 2D; Flexbox is 1D.',
    codeSnippet: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal fractional columns */
  gap: 20px;
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-slate-900 text-white rounded-lg text-xs">
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-blue-600 p-3 rounded text-center font-bold">Col 1</div>
        <div class="bg-indigo-600 p-3 rounded text-center font-bold">Col 2</div>
        <div class="bg-purple-600 p-3 rounded text-center font-bold">Col 3</div>
      </div>
      <p class="text-[10px] text-gray-400 mt-2 text-center">repeat(3, 1fr) divides space into 3 equal columns</p>
    </div>`,
    breakdown: [
      { term: 'display: grid', definition: 'Activates 2-dimensional grid layout on the parent container.', badge: 'Grid Root' },
      { term: 'repeat(3, 1fr)', definition: 'Convenient shorthand creating 3 equal columns of 1 fraction each.', badge: 'Columns' },
      { term: '1fr (Fraction)', definition: 'A fractional unit representing a share of available free space.', badge: 'Unit' },
      { term: 'Grid vs Flexbox', definition: 'Grid is 2-dimensional (rows & columns); Flexbox is 1-dimensional (row OR col).', badge: 'Comparison' }
    ],
    proTip: 'Use CSS Grid when you want structured rows and columns; use Flexbox when aligning items along a single direction like navbars or button groups.',
    commonMistake: 'Using Flexbox for complicated card matrices when CSS Grid repeat(auto-fit, minmax(250px, 1fr)) is much cleaner.'
  },

  'css-responsive': {
    summary: 'Responsive Web Design ensures websites adapt seamlessly across mobile phones, tablets, and large desktop screens. Media queries (@media) apply specific CSS rules only when screen dimensions match conditions like screen width.',
    keyRule: '@media (min-width: 768px) { ... } applies styles on screens 768px and wider • Mobile-first starts with mobile styles.',
    codeSnippet: `/* Base Mobile Styles (Default) */
.container {
  padding: 12px;
  font-size: 14px;
}

/* Tablet & Desktop: Apply styles when screen is 768px or wider */
@media (min-width: 768px) {
  .container {
    padding: 32px;
    font-size: 18px;
  }
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-slate-900 text-white rounded-lg text-left text-xs space-y-2">
      <div class="border border-sky-500/30 bg-sky-500/10 p-2 rounded">
        <span class="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">Mobile First Philosophy:</span>
        <p class="text-gray-300">Design for mobile devices first, then enhance for larger desktop viewports with media queries!</p>
      </div>
      <div class="font-mono text-[11px] text-emerald-400">@media (min-width: 768px) { ... }</div>
    </div>`,
    breakdown: [
      { term: '@media', definition: 'CSS at-rule used to apply styling rules conditionally based on device media types.', badge: 'Rule' },
      { term: 'min-width: 768px', definition: 'Applies rules when viewport width is at least 768px (tablets and desktops).', badge: 'Breakpoint' },
      { term: 'Mobile-first', definition: 'Writing base CSS for mobile phones first, then adding media queries as screens grow.', badge: 'Architecture' }
    ],
    proTip: 'Mobile-first design makes websites faster and cleaner because mobile devices load less CSS overhead.',
    commonMistake: 'Hardcoding fixed pixel widths (like width: 1200px) that cause horizontal scrolling on mobile phones.'
  },

  'css-boss': {
    summary: 'The CSS Master Challenge tests your combined understanding of selectors, the box model, typography, flexbox layouts, hover states, and color hierarchy!',
    keyRule: 'border-radius rounds corners • transition creates smooth animations • .card:hover targets hover states.',
    codeSnippet: `.card {
  border-radius: 12px;         /* Smooth rounded corners */
  transition: transform 0.2s;  /* Smooth state transition */
}

/* Pseudo-class selector for mouse hover */
.card:hover {
  transform: translateY(-4px);
}`,
    codeLanguage: 'css',
    previewHtml: `<div class="p-3 font-sans bg-white text-gray-900 rounded-lg text-left text-xs">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <span class="text-[9px] font-black uppercase tracking-wider text-blue-200 block">Master Challenge</span>
          <h4 class="font-bold text-sm">CSS Layout Boss</h4>
        </div>
        <span class="text-xl">🎨</span>
      </div>
    </div>`,
    breakdown: [
      { term: 'border-radius', definition: 'Rounds the corners of an element box.', badge: 'Styling' },
      { term: '.card:hover', definition: 'Pseudo-class targeting the element when the user hovers their mouse cursor.', badge: 'Interaction' },
      { term: 'transition', definition: 'Animates changes smoothly between CSS states.', badge: 'Animation' }
    ],
    proTip: 'Think about responsiveness and clean spacing before writing selectors.',
    commonMistake: 'Overusing !important when higher specificity or correct selector order is cleaner.'
  },

  // ==========================================
  // --- PHP MODULE (7 Lessons) ---
  // ==========================================

  'php-syntax': {
    summary: 'PHP (Hypertext Preprocessor) is a server-side scripting language. Unlike HTML/CSS which run in the visitor browser, PHP code executes on the web server before the HTML is sent to the client. Every PHP script block begins with <?php and ends with ?>. Every statement must conclude with a semicolon (;).',
    keyRule: 'Open PHP with <?php • End with ?> • Statements MUST end with a semicolon (;) • Output text with echo.',
    codeSnippet: `<?php
  // Output text to the client browser
  echo "Hello World from PHP!";
  echo "Welcome to Server-Side Coding";
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Hello World from PHP!
Welcome to Server-Side Coding`,
    breakdown: [
      { term: '<?php ... ?>', definition: 'Delimiters that tell the web server to execute the code inside as PHP.', badge: 'PHP Tag' },
      { term: 'echo', definition: 'Language construct used to output text, variables, and HTML to the browser.', badge: 'Output' },
      { term: '; (semicolon)', definition: 'Mandatory statement terminator. Omitting it causes a fatal parse error.', badge: 'Syntax' },
      { term: 'Server Execution', definition: 'Runs on the server before sending raw HTML down to visitor browser.', badge: 'Architecture' }
    ],
    proTip: 'Browsers NEVER see raw PHP code. They only receive the resulting HTML output that the server generated.',
    commonMistake: 'Forgetting the semicolon (;) at the end of an echo statement.'
  },

  'php-variables': {
    summary: 'Variables are containers that store data values in server memory—like numbers, text strings, and booleans. In PHP, all variable names must begin with a dollar sign ($). Variable names can contain letters, numbers, and underscores (e.g. $user_score).',
    keyRule: 'All PHP variables must start with $ (e.g. $user_score = 100;) • Assignment uses =.',
    codeSnippet: `<?php
  $user_score = 100;
  $username = "Elena";

  echo "Player: " . $username . " has " . $user_score . " points!";
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Player: Elena has 100 points!`,
    breakdown: [
      { term: '$variable', definition: 'The dollar sign $ indicates a variable name in PHP.', badge: 'Variable' },
      { term: '$user_score', definition: 'Valid PHP variable name using lowercase letters and underscores.', badge: 'Naming' },
      { term: '= (Assignment)', definition: 'Assigns the right-hand value into the left-hand variable container.', badge: 'Operator' }
    ],
    proTip: 'In double-quoted strings, PHP automatically interpolates variables: echo "Hello $username"; works seamlessly!',
    commonMistake: 'Forgetting the leading $ when referencing a variable: writing user_score instead of $user_score.'
  },

  'php-conditionals': {
    summary: 'Conditionals allow your server application to make decisions based on dynamic state—like checking if a student is logged in, or if a user has sufficient hearts remaining.',
    keyRule: 'if (condition) { ... } else { ... } • === checks for equal value AND identical data type.',
    codeSnippet: `<?php
  $isLoggedIn = true;

  if ($isLoggedIn) {
    echo "Welcome back, student!";
  } else {
    echo "Please sign in to continue.";
  }
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Welcome back, student!`,
    breakdown: [
      { term: 'if (...)', definition: 'Evaluates the condition. If true, runs the code inside the curly braces {}.', badge: 'Decision' },
      { term: 'else', definition: 'Default fallback branch executed when the if check evaluates to false.', badge: 'Fallback' },
      { term: '=== Operator', definition: 'Strict comparison operator checking that value AND type match identically.', badge: 'Strict Equality' }
    ],
    proTip: 'Always use === (strict comparison) to compare both value and data type to avoid unexpected type juggling bugs.',
    commonMistake: 'Accidentally using a single equals = (assignment) instead of double == or triple === (comparison).'
  },

  'php-arrays': {
    summary: 'An array is a data structure that holds multiple values under a single variable name. PHP supports indexed arrays (created with square brackets []) and associative arrays (using => to associate keys with values).',
    keyRule: '$arr = ["HTML", "CSS", "PHP"]; • Associative arrays use =>: ["key" => "value"].',
    codeSnippet: `<?php
  // Indexed Array
  $languages = ["HTML", "CSS", "PHP"];

  // Associative Array (Key => Value)
  $course = [
    "title" => "Backend PHP",
    "level" => "Intermediate"
  ];

  echo "Learning: " . $languages[0] . " | " . $course["title"];
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Learning: HTML | Backend PHP`,
    breakdown: [
      { term: '[ ... ]', definition: 'Square brackets create indexed or associative arrays in modern PHP.', badge: 'Array Syntax' },
      { term: '=> Operator', definition: 'Fat arrow operator that associates keys with their respective values.', badge: 'Key-Value' },
      { term: '$arr[0]', definition: 'Accesses elements by numeric index (arrays are 0-indexed).', badge: 'Index' }
    ],
    proTip: 'Associative arrays in PHP are directly equivalent to JSON objects or Python dictionaries.',
    commonMistake: 'Remembering arrays start at index 0. The first item is $arr[0], NOT $arr[1].'
  },

  'php-loops': {
    summary: 'Loops repeat a block of code multiple times. The foreach loop is the most popular loop in PHP for iterating through arrays of items, database rows, and curriculum lessons. The count() function returns the total number of items.',
    keyRule: 'foreach ($skills as $skill) { ... } iterates array • count($skills) returns total item count.',
    codeSnippet: `<?php
  $skills = ["Flexbox", "Grid", "PHP"];

  echo "Total skills: " . count($skills) . "\\n";

  foreach ($skills as $skill) {
    echo "Mastered: " . $skill . "\\n";
  }
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Total skills: 3
Mastered: Flexbox
Mastered: Grid
Mastered: PHP`,
    breakdown: [
      { term: 'foreach', definition: 'Iterates through each element in an array without manual index counters.', badge: 'Loop' },
      { term: '$array as $item', definition: 'Assigns each item to the alias variable for that cycle.', badge: 'Item Alias' },
      { term: 'count($array)', definition: 'Built-in function returning the total count of items in an array.', badge: 'Utility' }
    ],
    proTip: 'Use foreach ($array as $key => $value) if you need access to both the array key and value simultaneously.',
    commonMistake: 'Forgetting the as keyword: writing foreach ($skills $skill) instead of foreach ($skills as $skill).'
  },

  'php-functions': {
    summary: 'Functions encapsulate reusable logic into self-contained blocks. You declare a function with the function keyword, accept parameters, and return computed results using the return statement. Strings are concatenated using the period (.) operator.',
    keyRule: 'function name($param) { return $result; } • Concatenate strings with period (.) operator.',
    codeSnippet: `<?php
  function calculateTotal($baseXp, $bonus) {
    return $baseXp + $bonus;
  }

  $score = calculateTotal(50, 25);
  // String concatenation with . (period)
  echo "Total XP Earned: " . $score;
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Total XP Earned: 75`,
    breakdown: [
      { term: 'function', definition: 'Keyword that defines a custom reusable function block.', badge: 'Definition' },
      { term: 'return', definition: 'Sends the calculated result back to the caller and exits the function.', badge: 'Output' },
      { term: '. (period)', definition: 'String concatenation operator used to join strings and variables.', badge: 'Concat' }
    ],
    proTip: 'Keep functions focused on a single responsibility. This makes your server codebase testable and easy to maintain.',
    commonMistake: 'Using + to concatenate strings (like JavaScript or Python). In PHP, + is only for arithmetic; use . for strings.'
  },

  'php-forms': {
    summary: 'When a visitor submits an HTML form with method="POST", PHP receives the submitted values in the $_POST superglobal array. To prevent malicious Cross-Site Scripting (XSS) attacks, always sanitize user input with htmlspecialchars() before displaying it.',
    keyRule: '$_POST["field_name"] retrieves submitted form data • htmlspecialchars() prevents XSS attacks.',
    codeSnippet: `<?php
  // Retrieve submitted email from POST request
  $email = $_POST["email"];

  // Sanitize input to prevent Cross-Site Scripting (XSS)
  $safeEmail = htmlspecialchars($email);

  echo "Confirmation sent to: " . $safeEmail;
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Confirmation sent to: student@academy.edu`,
    breakdown: [
      { term: '$_POST', definition: 'Superglobal associative array holding form values sent via HTTP POST.', badge: 'Superglobal' },
      { term: 'htmlspecialchars()', definition: 'Converts special characters (<, >, &, ") into HTML entities to stop XSS.', badge: 'Security' },
      { term: 'XSS Prevention', definition: 'Stops malicious attackers from executing malicious JavaScript on your users.', badge: 'Protection' }
    ],
    proTip: 'Never trust user input! Always validate and sanitize every value from $_POST and $_GET before echoing or storing in databases.',
    commonMistake: 'Directly echoing $_POST["comment"] without htmlspecialchars(), opening an immediate XSS security hole.'
  },

  'php-boss': {
    summary: 'The Backend Architect Boss Challenge tests your command of PHP server logic, superglobals, empty() validation, server execution flow, and dynamic output generation.',
    keyRule: 'empty($var) checks for empty input • PHP executes on web server BEFORE sending HTML to browser.',
    codeSnippet: `<?php
  $username = $_POST["username"] ?? "";

  if (empty($username)) {
    echo "Username is required!";
  } else {
    echo "Welcome to the server, " . htmlspecialchars($username);
  }
?>`,
    codeLanguage: 'php',
    terminalOutput: `Server Output:
Welcome to the server, MasterDeveloper`,
    breakdown: [
      { term: 'empty()', definition: 'Checks whether a variable does not exist or has an empty/falsy value.', badge: 'Validation' },
      { term: 'Server Execution', definition: 'PHP code executes on the web server before the response reaches the browser.', badge: 'Architecture' }
    ],
    proTip: 'Read the logic requirements step-by-step. Keep variable names clear and verify conditions.',
    commonMistake: 'Thinking PHP runs inside Google Chrome. PHP executes strictly on the web server.'
  },

  // ==========================================
  // --- REACT & NEXT.JS ADVANCED MODULES ---
  // ==========================================
  'react-components-props': {
    summary: 'React uses declarative JSX and functional components to compose rich, interactive user interfaces. Data flows strictly unidirectionally from parent to child components through read-only props.',
    keyRule: 'Props are read-only and immutable • Components must return valid JSX • Use PascalCase for component names.',
    codeSnippet: `function UserCard({ name, role, isPro }) {
  return (
    <div className="card">
      <h3>{name} {isPro && "👑"}</h3>
      <span className="badge">{role}</span>
    </div>
  );
}`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 bg-white text-gray-900 rounded-lg shadow-sm">
      <h3 class="font-bold text-base">Alex Rivera 👑</h3>
      <span class="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Staff Engineer</span>
    </div>`,
    breakdown: [
      { term: 'JSX', definition: 'JavaScript XML syntax allowing HTML-like templates inside JS functions.', badge: 'Syntax' },
      { term: 'Props', definition: 'Immutable configuration passed down from parent components to child components.', badge: 'Data' },
      { term: 'Unidirectional Flow', definition: 'State flows downwards; actions flow upwards via callback events.', badge: 'Architecture' }
    ],
    proTip: 'Always destructure props in function arguments for cleaner, more readable code.',
    commonMistake: 'Trying to mutate props directly inside a child component (props.name = "new"). Props are read-only!'
  },

  'react-hooks-state': {
    summary: 'Hooks allow functional components to hook into React state and lifecycle events. useState manages local component state, while useEffect handles asynchronous side effects like data fetching, subscriptions, and timers.',
    keyRule: 'useState(init) returns [state, setter] • useEffect with [] runs only once on initial mount • Never call hooks inside loops or conditions.',
    codeSnippet: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>+1</button>;
}`,
    codeLanguage: 'html',
    previewHtml: `<div class="p-3 bg-gray-900 text-white rounded-lg flex items-center gap-3">
      <span class="font-mono text-sm">Count: 42</span>
      <button class="px-3 py-1 bg-sky-500 rounded text-xs font-bold">+1 Increment</button>
    </div>`,
    breakdown: [
      { term: 'useState', definition: 'Preserves local state across re-renders and triggers UI updates when setter is invoked.', badge: 'State' },
      { term: 'useEffect', definition: 'Executes side-effects after the component renders, synchronizing with external systems.', badge: 'Lifecycle' },
      { term: 'Dependency Array', definition: 'Controls when useEffect re-executes based on referenced variables.', badge: 'Performance' }
    ],
    proTip: 'Use functional updates setCount(prev => prev + 1) when new state depends on previous state to avoid race conditions.',
    commonMistake: 'Omitting dependency variables from the useEffect dependency array, creating stale closure bugs.'
  },

  'react-boss': {
    summary: 'The React Architecture Boss Challenge tests your command of reconciliation, useMemo, useCallback, custom hooks, and memoization patterns.',
    keyRule: 'Keys must be stable and unique • useCallback memoizes functions • useMemo memoizes computed values.',
    codeSnippet: `const memoizedValue = useMemo(() => computeHeavyMath(list), [list]);
const handleAction = useCallback(() => doSomething(id), [id]);`,
    codeLanguage: 'html',
    breakdown: [
      { term: 'Reconciliation', definition: 'React virtual DOM diffing algorithm that applies minimal real DOM mutations.', badge: 'Engine' },
      { term: 'useCallback', definition: 'Memoizes callback references across renders to prevent unnecessary child re-renders.', badge: 'Optimization' }
    ],
    proTip: 'Profile components with React DevTools before prematurely optimizing with useMemo.',
    commonMistake: 'Using Math.random() or array index as list keys, which destroys DOM state across re-orders.'
  },

  'nextjs-server-actions': {
    summary: 'Next.js App Router introduces React Server Components (RSC) and Server Actions. Server Actions allow client components to invoke asynchronous backend functions directly with zero API boilerplate.',
    keyRule: '"use server" marks async backend code • Server Components execute strictly on Node.js/Edge and send zero client JS.',
    codeSnippet: `// Server Action inside Next.js
export async function updateUsername(formData) {
  "use server";
  const name = formData.get("name");
  await db.users.update({ name });
}`,
    codeLanguage: 'html',
    terminalOutput: `Server Action Executed:
[POST] /_next/action -> updateUsername: 200 OK`,
    breakdown: [
      { term: '"use server"', definition: 'Directive marking an asynchronous function as a callable server RPC action.', badge: 'Directive' },
      { term: 'RSC', definition: 'React Server Components rendered entirely on the backend server for instant page loads.', badge: 'Rendering' }
    ],
    proTip: 'Server Components can directly query databases with SQL/Prisma without exposing credentials to the client.',
    commonMistake: 'Putting "use client" on every single file. Keep components server-side by default and only opt-in to client where interactivity is needed.'
  },

  'web-security-xss-csrf': {
    summary: 'Modern web applications require defense-in-depth security. Prevent Cross-Site Scripting (XSS) with sanitization and CSP headers; mitigate CSRF using SameSite httpOnly cookies and anti-forgery tokens.',
    keyRule: 'Always set httpOnly and SameSite=Strict on session cookies • Sanitize user HTML with DOMPurify.',
    codeSnippet: `// Secure Cookie Configuration
res.cookie("session_token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 86400 * 1000
});`,
    codeLanguage: 'html',
    breakdown: [
      { term: 'httpOnly', definition: 'Prevents client JavaScript from reading session cookies via document.cookie.', badge: 'Security' },
      { term: 'SameSite=Strict', definition: 'Blocks browsers from sending cookies on cross-site requests, eliminating CSRF.', badge: 'Protection' },
      { term: 'CSP', definition: 'Content Security Policy restricting trusted script and resource domains.', badge: 'Policy' }
    ],
    proTip: 'Never store sensitive JWT auth tokens in localStorage where XSS attacks can extract them.',
    commonMistake: 'Relying solely on frontend input validation. Always validate and sanitize on the server side!'
  },

  'fullstack-boss': {
    summary: 'The Full-Stack Web Architect Boss Challenge tests complete mastery over Next.js App Router, caching invalidation, and production web security.',
    keyRule: 'revalidatePath() purges cache • RSC delivers zero JS bundle • DOMPurify cleans untrusted markup.',
    codeSnippet: `import { revalidatePath } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

export async function publishPost(content) {
  "use server";
  const clean = DOMPurify.sanitize(content);
  await db.posts.create({ text: clean });
  revalidatePath("/feed");
}`,
    codeLanguage: 'html',
    breakdown: [
      { term: 'revalidatePath', definition: 'On-demand server cache invalidation for instant content updates.', badge: 'Next.js' },
      { term: 'Defense-in-depth', definition: 'Layered security with CSP, httpOnly cookies, and input sanitization.', badge: 'Architecture' }
    ],
    proTip: 'Combine Server Actions with optimistic UI updates for instantaneous user feedback.',
    commonMistake: 'Forgetting to revalidate the server cache after mutating data, leaving users with stale views.'
  }
};

// Aliases for alternate naming conventions
LESSON_CONCEPTS['html-elements'] = LESSON_CONCEPTS['html-skeleton'];
LESSON_CONCEPTS['html-meta'] = LESSON_CONCEPTS['html-metadata'];
LESSON_CONCEPTS['php-intro'] = LESSON_CONCEPTS['php-syntax'];

import { PYTHON_CONCEPTS } from './concepts/pythonConcepts';
import { JAVA_CONCEPTS } from './concepts/javaConcepts';
import { CPP_CONCEPTS } from './concepts/cppConcepts';
import { BACKEND_CONCEPTS } from './concepts/backendConcepts';
import { DEVOPS_CONCEPTS } from './concepts/devopsConcepts';

Object.assign(
  LESSON_CONCEPTS,
  PYTHON_CONCEPTS,
  JAVA_CONCEPTS,
  CPP_CONCEPTS,
  BACKEND_CONCEPTS,
  DEVOPS_CONCEPTS
);
