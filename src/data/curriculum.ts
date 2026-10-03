export interface Exercise {
  id: string;
  type: 'choice' | 'fill' | 'create';
  question: string;
  explanation?: string;
  code?: string[];
  blanks?: number[];
  options: string[];
  correct: string[];
  hint: string;
  placeholder?: string;
  starterCode?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  isBoss?: boolean;
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
  isAdvanced?: boolean;
}

export const CURRICULUM: Module[] = [
  // ==========================================
  // --- MODULE 1: HTML FOUNDATIONS ---
  // ==========================================
  {
    id: 'html-1',
    title: 'HTML: Foundation of the Web',
    subtitle: 'Module 1',
    description: 'Learn the core building blocks used to structure every website in the world.',
    isAdvanced: false,
    lessons: [
      {
        id: 'html-intro',
        title: 'What is HTML?',
        description: 'Understand elements, tags, and how web browsers read HTML.',
        exercises: [
          {
            id: 'hi-1',
            type: 'choice',
            question: 'What does HTML stand for in web development?',
            hint: 'It describes how text and links are marked up for browsers.',
            options: [
              'HyperText Markup Language',
              'High Technical Modern Language',
              'Home Tool Multi-Language',
              'Hyperlink Text Management Logic'
            ],
            correct: ['HyperText Markup Language'],
            explanation: 'HTML stands for HyperText Markup Language—the foundational structural standard of the web.'
          },
          {
            id: 'hi-2',
            type: 'fill',
            question: 'Complete the heading element with opening and closing h1 tags:',
            hint: 'HTML tags open with <tag> and close with </tag>.',
            code: ['<', 'h1', '>', 'Hello Web Developer', '</', 'h1', '>'],
            blanks: [1, 5],
            options: ['h1', 'h1', 'p', 'p', 'head', 'head'],
            correct: ['h1', 'h1'],
            explanation: 'Heading elements open with <h1> and must close with matching </h1>.'
          },
          {
            id: 'hi-3',
            type: 'create',
            question: 'Create the closing tag for a paragraph (<p>) element:',
            hint: 'Closing tags always begin with a forward slash: </tagname>',
            placeholder: '</p>',
            starterCode: '<p>Learning to code is empowering!',
            options: [],
            correct: ['</p>', '</p >'],
            explanation: '</p> closes the paragraph, telling the browser the block of text has ended.'
          }
        ]
      },
      {
        id: 'html-skeleton',
        title: 'Document Structure',
        description: 'Master the anatomy of an HTML document: DOCTYPE, html, head, and body.',
        exercises: [
          {
            id: 'hs-1',
            type: 'fill',
            question: 'Every modern HTML5 page starts with the DOCTYPE declaration. Complete it:',
            hint: '<!DOCTYPE html> declares this document as modern HTML5.',
            code: ['<', '!', 'DOCTYPE', 'html', '>'],
            blanks: [1, 2],
            options: ['!', 'DOCTYPE', 'HTML5', 'XML', 'DOC', 'TYPE'],
            correct: ['!', 'DOCTYPE'],
            explanation: '<!DOCTYPE html> must be the first line of any modern HTML5 document.'
          },
          {
            id: 'hs-2',
            type: 'choice',
            question: 'Where does visible page content (headings, images, text) belong?',
            hint: 'The head holds metadata, but user-visible items go in the body.',
            options: [
              'Inside the <body> tag',
              'Inside the <head> tag',
              'Directly in <!DOCTYPE>',
              'Inside the <meta> tag'
            ],
            correct: ['Inside the <body> tag'],
            explanation: 'All visible content seen by website visitors lives inside <body>...</body>.'
          },
          {
            id: 'hs-3',
            type: 'fill',
            question: 'Wrap the page contents inside the opening and closing body tags:',
            hint: 'The body tag opens with <body> and ends with </body>.',
            code: ['<', 'body', '>', 'Hello Coder!', '</', 'body', '>'],
            blanks: [1, 5],
            options: ['body', 'body', 'main', 'main', 'head', 'head'],
            correct: ['body', 'body'],
            explanation: 'Visible markup opens with <body> and terminates with the closing </body> tag.'
          }
        ]
      },
      {
        id: 'html-headings',
        title: 'Headings & Titles',
        description: 'Structure text content with heading levels h1 through h6.',
        exercises: [
          {
            id: 'hh-1',
            type: 'fill',
            question: 'Create the most important top-level page heading with opening and closing tags:',
            hint: 'h1 is the highest rank heading and should only appear once per page.',
            code: ['<', 'h1', '>', 'Welcome to My Site', '</', 'h1', '>'],
            blanks: [1, 5],
            options: ['h1', 'h1', 'h2', 'h2', 'title', 'head'],
            correct: ['h1', 'h1'],
            explanation: 'The main page title uses <h1>...</h1> for highest semantic hierarchy.'
          },
          {
            id: 'hh-2',
            type: 'choice',
            question: 'Which heading tag represents the smallest, lowest-level heading?',
            hint: 'Headings range from 1 down to 6.',
            options: ['<h6>', '<h1>', '<h0>', '<h10>'],
            correct: ['<h6>'],
            explanation: '<h6> is the smallest heading level; <h1> is the highest.'
          },
          {
            id: 'hh-3',
            type: 'create',
            question: 'Write the opening tag for a level 2 section sub-heading:',
            hint: 'Level 2 subheadings use the h2 tag.',
            placeholder: '<h2>',
            starterCode: '<!-- Subheading starts here -->',
            options: [],
            correct: ['<h2>', '<h2 >'],
            explanation: '<h2> creates a secondary section heading beneath the main <h1>.'
          }
        ]
      },
      {
        id: 'html-paragraphs',
        title: 'Paragraphs & Text',
        description: 'Format regular text using paragraphs, bold, and line breaks.',
        exercises: [
          {
            id: 'hp-1',
            type: 'fill',
            question: 'Create a regular paragraph of text with opening and closing tags:',
            hint: 'The paragraph tag is <p> and closes with </p>.',
            code: ['<', 'p', '>', 'This is my article.', '</', 'p', '>'],
            blanks: [1, 5],
            options: ['p', 'p', 'span', 'span', 'text', 'b'],
            correct: ['p', 'p'],
            explanation: '<p>...</p> wraps sentences into standard body paragraphs with default vertical margins.'
          },
          {
            id: 'hp-2',
            type: 'choice',
            question: 'Which tag is used to give text strong importance (bold styling)?',
            hint: 'It conveys semantic importance, not just cosmetic bolding.',
            options: ['<strong>', '<bold>', '<heavy>', '<fat>'],
            correct: ['<strong>'],
            explanation: '<strong> represents content of strong importance and is rendered bold by default.'
          },
          {
            id: 'hp-3',
            type: 'create',
            question: 'Write the self-closing tag that creates a line break without starting a new paragraph:',
            hint: 'The break tag is <br>.',
            placeholder: '<br>',
            starterCode: 'Line 1 of address\nLine 2 of address',
            options: [],
            correct: ['<br>', '<br/>', '<br />'],
            explanation: '<br> inserts a single line break in text flow without creating extra paragraph spacing.'
          }
        ]
      },
      {
        id: 'html-links',
        title: 'Hyperlinks & Nav',
        description: 'Connect web pages using the anchor <a> tag and the href attribute.',
        exercises: [
          {
            id: 'hl-1',
            type: 'fill',
            question: 'Complete the link tag with the correct attribute for the URL destination:',
            hint: 'href stands for Hypertext Reference.',
            code: ['<a', 'href="https://google.com"', '>', 'Search', '</a>'],
            blanks: [1],
            options: ['href="https://google.com"', 'src="https://google.com"', 'link="https://google.com"', 'url="https://google.com"'],
            correct: ['href="https://google.com"'],
            explanation: 'The href attribute specifies the destination web address of the hyperlink.'
          },
          {
            id: 'hl-2',
            type: 'create',
            question: 'Write the target attribute and value to instruct a link to open in a new browser tab:',
            hint: 'target="_blank" tells the browser to launch a new tab.',
            placeholder: 'target="_blank"',
            starterCode: '<a href="https://github.com" ...>GitHub</a>',
            options: [],
            correct: ['target="_blank"', "target='_blank'", 'target=_blank'],
            explanation: 'target="_blank" ensures external links open safely in a separate tab.'
          },
          {
            id: 'hl-3',
            type: 'fill',
            question: 'Complete the opening and closing anchor tags that link to a contact page:',
            hint: 'Anchor links open with <a> and close with </a>.',
            code: ['<', 'a', 'href="/contact"', '>', 'Contact Us', '</', 'a', '>'],
            blanks: [1, 6],
            options: ['a', 'a', 'link', 'link', 'nav', 'url'],
            correct: ['a', 'a'],
            explanation: '<a> and </a> wrap clickable text or images to turn them into hyperlinks.'
          }
        ]
      },
      {
        id: 'html-images',
        title: 'Images & Media',
        description: 'Embed images with the self-closing <img> tag, src, and alt attributes.',
        exercises: [
          {
            id: 'hm-1',
            type: 'choice',
            question: 'Does the <img> tag require a closing </img> tag in HTML5?',
            hint: 'Images cannot have text children, so they are void elements.',
            options: [
              'No, <img> is a self-closing element',
              'Yes, <img> must always have </img>',
              'Only when using JPEG format',
              'Only inside tables'
            ],
            correct: ['No, <img> is a self-closing element'],
            explanation: '<img> is a self-closing void tag and never takes a closing </img>.'
          },
          {
            id: 'hm-2',
            type: 'fill',
            question: 'Specify the image file source and alt description using the proper attributes:',
            hint: 'src points to the image file; alt provides accessible fallback description.',
            code: ['<img', 'src="cat.jpg"', 'alt="Cute orange cat"', '/>'],
            blanks: [1, 2],
            options: ['src="cat.jpg"', 'alt="Cute orange cat"', 'url="cat.jpg"', 'title="Cute orange cat"', 'href="cat.jpg"'],
            correct: ['src="cat.jpg"', 'alt="Cute orange cat"'],
            explanation: 'src specifies the path to the picture; alt provides critical accessibility text.'
          },
          {
            id: 'hm-3',
            type: 'create',
            question: 'Write the attribute name used to supply alternative text for screen readers on an <img> tag:',
            hint: 'Short for "alternative text".',
            placeholder: 'alt',
            starterCode: '<img src="profile.png" ...="User Profile Photo">',
            options: [],
            correct: ['alt', 'alt='],
            explanation: 'The alt attribute is read aloud by screen readers and shown if the image fails to load.'
          }
        ]
      },
      {
        id: 'html-lists',
        title: 'Lists & Navigation',
        description: 'Organize data using bulleted (ul) and numbered (ol) lists with items (li).',
        exercises: [
          {
            id: 'hli-1',
            type: 'choice',
            question: 'Which tag creates a bulleted (unordered) list?',
            hint: 'Think of "unordered list".',
            options: ['<ul>', '<ol>', '<dl>', '<list>'],
            correct: ['<ul>'],
            explanation: '<ul> creates an unordered bulleted list, whereas <ol> creates numbered steps.'
          },
          {
            id: 'hli-2',
            type: 'fill',
            question: 'Complete an ordered (numbered) list with opening and closing list item tags:',
            hint: 'List items are wrapped inside <li>...</li> tags.',
            code: ['<ol>', '<', 'li', '>', 'Step 1', '</', 'li', '>', '</ol>'],
            blanks: [2, 6],
            options: ['li', 'li', 'ol', 'ol', 'ul', 'item'],
            correct: ['li', 'li'],
            explanation: '<li> tags wrap every item inside both <ul> and <ol> parent lists.'
          },
          {
            id: 'hli-3',
            type: 'fill',
            question: 'Wrap items in an opening and closing unordered list container:',
            hint: 'Unordered lists open with <ul> and terminate with </ul>.',
            code: ['<', 'ul', '>', '<li>Apple</li>', '</', 'ul', '>'],
            blanks: [1, 4],
            options: ['ul', 'ul', 'ol', 'ol', 'list', 'li'],
            correct: ['ul', 'ul'],
            explanation: '<ul> wraps the collection of bulleted items and closes with </ul>.'
          }
        ]
      },
      {
        id: 'html-forms',
        title: 'Forms & Inputs',
        description: 'Collect user data with forms, text inputs, buttons, and labels.',
        exercises: [
          {
            id: 'hf-1',
            type: 'fill',
            question: 'Create a text input field for a user to type their username:',
            hint: 'type="text" creates a standard input box.',
            code: ['<input', 'type="text"', 'placeholder="Enter username"', '/>'],
            blanks: [1, 2],
            options: ['type="text"', 'placeholder="Enter username"', 'type="password"', 'value="Enter username"', 'name="user"'],
            correct: ['type="text"', 'placeholder="Enter username"'],
            explanation: 'type="text" provides a single-line input field with optional placeholder hint.'
          },
          {
            id: 'hf-2',
            type: 'create',
            question: 'Write the input type value that masks typed characters with dots for passwords:',
            hint: 'type="password"',
            placeholder: 'password',
            starterCode: '<input type="..." id="user-pass">',
            options: [],
            correct: ['password', 'type="password"', "type='password'"],
            explanation: 'type="password" ensures sensitive credentials are hidden from onlookers.'
          },
          {
            id: 'hf-3',
            type: 'fill',
            question: 'Create a clickable submission button inside a form with opening and closing tags:',
            hint: 'Button tags open with <button> and end with </button>.',
            code: ['<', 'button', 'type="submit"', '>', 'Send', '</', 'button', '>'],
            blanks: [1, 6],
            options: ['button', 'button', 'input', 'input', 'submit', 'click'],
            correct: ['button', 'button'],
            explanation: '<button type="submit"> sends the completed form data to the destination server.'
          }
        ]
      },
      {
        id: 'html-tables',
        title: 'Tables & Grids',
        description: 'Display structured information with table rows, headers, and data cells.',
        exercises: [
          {
            id: 'ht-1',
            type: 'create',
            question: 'Write the opening tag that defines a table row in an HTML table:',
            hint: 'Short for Table Row.',
            placeholder: '<tr>',
            starterCode: '<table>\n  ...\n  <td>Cell</td>\n</tr>',
            options: [],
            correct: ['<tr>', '<tr >'],
            explanation: '<tr> creates each horizontal row inside an HTML <table>.'
          },
          {
            id: 'ht-2',
            type: 'fill',
            question: 'Complete the table header row containing header cells (th):',
            hint: 'Header cells open with <th> and close with </th>.',
            code: ['<tr>', '<', 'th', '>', 'Name', '</', 'th', '>', '</tr>'],
            blanks: [2, 6],
            options: ['th', 'th', 'td', 'td', 'tr', 'tr'],
            correct: ['th', 'th'],
            explanation: '<th> elements represent bold header cells at the top of table columns.'
          },
          {
            id: 'ht-3',
            type: 'fill',
            question: 'Add a standard data cell (td) to a table row with opening and closing tags:',
            hint: 'Data cells are defined by <td>...</td> (Table Data).',
            code: ['<tr>', '<', 'td', '>', 'Alex', '</', 'td', '>', '</tr>'],
            blanks: [2, 6],
            options: ['td', 'td', 'th', 'th', 'tr', 'data'],
            correct: ['td', 'td'],
            explanation: '<td> holds individual data values in standard table rows.'
          }
        ]
      },
      {
        id: 'html-semantic',
        title: 'Semantic Layout',
        description: 'Organize pages cleanly with header, nav, main, section, and footer elements.',
        exercises: [
          {
            id: 'hsem-1',
            type: 'create',
            question: 'Write the semantic opening tag intended to wrap primary website navigation links:',
            hint: 'Short for Navigation.',
            placeholder: '<nav>',
            starterCode: '<header>\n  ...\n  <a href="/">Home</a>\n</nav>',
            options: [],
            correct: ['<nav>', '<nav >'],
            explanation: '<nav> informs search engines and screen readers where menu links are located.'
          },
          {
            id: 'hsem-2',
            type: 'fill',
            question: 'Wrap the top introduction and logo in opening and closing semantic header tags:',
            hint: 'Header tags open with <header> and close with </header>.',
            code: ['<', 'header', '>', '<h1>CodeQuest</h1>', '</', 'header', '>'],
            blanks: [1, 4],
            options: ['header', 'header', 'head', 'head', 'top', 'nav'],
            correct: ['header', 'header'],
            explanation: '<header> represents introductory content or navigational aids at the top of a page.'
          },
          {
            id: 'hsem-3',
            type: 'fill',
            question: 'Define the bottom section of the page containing copyright info:',
            hint: 'Footer tags open with <footer> and end with </footer>.',
            code: ['<', 'footer', '>', '<p>&copy; 2026</p>', '</', 'footer', '>'],
            blanks: [1, 4],
            options: ['footer', 'footer', 'bottom', 'end', 'section', 'section'],
            correct: ['footer', 'footer'],
            explanation: '<footer> represents author details, copyright notices, and legal disclaimers.'
          }
        ]
      },
      {
        id: 'html-media',
        title: 'Audio & Video',
        description: 'Embed rich media directly into webpages with HTML5 multimedia tags.',
        exercises: [
          {
            id: 'hmed-1',
            type: 'create',
            question: 'Write the boolean attribute added to a <video> or <audio> tag to display play/pause controls:',
            hint: 'Without controls, the user has no way to play or adjust volume.',
            placeholder: 'controls',
            starterCode: '<video width="320" height="240" ...>',
            options: [],
            correct: ['controls', 'controls="controls"', 'controls=true'],
            explanation: 'The controls attribute tells the browser to display standard playback buttons.'
          },
          {
            id: 'hmed-2',
            type: 'choice',
            question: 'Which tag is used to embed an external webpage or YouTube video inside your page?',
            hint: 'Short for Inline Frame.',
            options: ['<iframe>', '<embed-web>', '<window>', '<portal>'],
            correct: ['<iframe>'],
            explanation: '<iframe> creates an inline browser frame to embed YouTube videos, maps, and widgets.'
          },
          {
            id: 'hmed-3',
            type: 'fill',
            question: 'Create an audio player with user controls with opening and closing tags:',
            hint: 'Audio tags open with <audio> and close with </audio>.',
            code: ['<', 'audio', 'controls', '>', '<source src="tune.mp3">', '</', 'audio', '>'],
            blanks: [1, 6],
            options: ['audio', 'audio', 'video', 'video', 'sound', 'media'],
            correct: ['audio', 'audio'],
            explanation: '<audio controls>...</audio> embeds podcasts and sound clips directly in modern browsers.'
          }
        ]
      },
      {
        id: 'html-metadata',
        title: 'Metadata & The Head',
        description: 'Set browser tab titles, character sets, and link external CSS stylesheets.',
        exercises: [
          {
            id: 'hmeta-1',
            type: 'fill',
            question: 'Set the text that appears on the browser tab window with opening and closing tags:',
            hint: 'The page title is wrapped in <title>...</title> inside <head>.',
            code: ['<', 'title', '>', 'Home Page', '</', 'title', '>'],
            blanks: [1, 5],
            options: ['title', 'title', 'head', 'head', 'meta', 'h1'],
            correct: ['title', 'title'],
            explanation: '<title> defines the text shown in browser tab headers and Google search results.'
          },
          {
            id: 'hmeta-2',
            type: 'choice',
            question: 'Which tag inside <head> links an external CSS stylesheet file?',
            hint: 'It uses rel="stylesheet" and an href path.',
            options: [
              '<link rel="stylesheet" href="style.css">',
              '<style src="style.css">',
              '<css href="style.css">',
              '<script type="css" src="style.css">'
            ],
            correct: ['<link rel="stylesheet" href="style.css">'],
            explanation: '<link rel="stylesheet" href="..."> connects external stylesheets to style the HTML.'
          },
          {
            id: 'hmeta-3',
            type: 'create',
            question: 'Write the attribute name in <meta> used to declare UTF-8 international character encoding:',
            hint: '<meta charset="UTF-8">',
            placeholder: 'charset',
            starterCode: '<meta ...="UTF-8">',
            options: [],
            correct: ['charset', 'charset="UTF-8"'],
            explanation: 'charset="UTF-8" enables universal character encoding for international languages and emojis.'
          }
        ]
      },
      {
        id: 'html-boss',
        title: 'HTML Boss Challenge',
        isBoss: true,
        description: 'Prove your HTML mastery with this comprehensive developer quiz!',
        exercises: [
          {
            id: 'hb-1',
            type: 'choice',
            question: 'Which HTML snippet shows valid, correctly nested code?',
            hint: 'Tags must be closed in reverse order of opening (LIFO).',
            options: [
              '<p><strong>Hello World</strong></p>',
              '<p><strong>Hello World</p></strong>',
              '<strong><p>Hello World</strong></p>',
              '<p>Hello World<strong></p>'
            ],
            correct: ['<p><strong>Hello World</strong></p>'],
            explanation: 'Tags must close in reverse of their opening order: outer <p> wraps inner <strong>.'
          },
          {
            id: 'hb-2',
            type: 'fill',
            question: 'Fix the broken web page card by closing the div container:',
            hint: 'A division container closes with </div>.',
            code: ['<div class="card">', '<p>Info</p>', '</', 'div', '>'],
            blanks: [3],
            options: ['div', 'p', 'span', 'section'],
            correct: ['div'],
            explanation: 'The closing tag for <div class="card"> must be </div>.'
          },
          {
            id: 'hb-3',
            type: 'create',
            question: 'Write the complete closing tag for an HTML document root:',
            hint: 'The root container is <html>.',
            placeholder: '</html>',
            starterCode: '<!DOCTYPE html>\n<html>\n  <body>...</body>\n...',
            options: [],
            correct: ['</html>', '</html >'],
            explanation: '</html> is the final closing tag at the very bottom of every HTML web document.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 2: CSS STYLING ---
  // ==========================================
  {
    id: 'css-1',
    title: 'CSS: Visual Styling',
    subtitle: 'Module 2',
    description: 'Learn hex codes, flexbox layouts, grid, and responsive styling.',
    lessons: [
      {
        id: 'css-colors',
        title: 'Colors & Backgrounds',
        description: 'Learn hex codes, rgb, and background colors.',
        exercises: [
          {
            id: 'cc-1',
            type: 'fill',
            question: 'Set the text color of all h1 headings to blue in CSS:',
            hint: 'The CSS property for text color is simply "color".',
            code: ['h1', '{', 'color', ':', 'blue', ';', '}'],
            blanks: [2, 4],
            options: ['color', 'blue', 'text-color', 'font-color', 'background-color', 'red'],
            correct: ['color', 'blue'],
            explanation: 'In CSS, color controls the foreground text color.'
          },
          {
            id: 'cc-2',
            type: 'create',
            question: 'Write the CSS property name used to change the background fill color of an element:',
            hint: 'background-color sets the background color.',
            placeholder: 'background-color',
            starterCode: 'body {\n  ...: #0f172a;\n}',
            options: [],
            correct: ['background-color', 'background-color:', 'background'],
            explanation: 'background-color fills the container background with a color or hex code.'
          }
        ]
      },
      {
        id: 'css-box-model',
        title: 'The Box Model',
        description: 'Understand margin, padding, border, and element dimensions.',
        exercises: [
          {
            id: 'cbm-1',
            type: 'create',
            question: 'Write the CSS box model property that adds inner breathing space inside an element border:',
            hint: 'padding is inner space; margin is outer space.',
            placeholder: 'padding',
            starterCode: '.card {\n  ...: 20px;\n}',
            options: [],
            correct: ['padding', 'padding:'],
            explanation: 'Padding adds internal breathing room between element content and its border.'
          },
          {
            id: 'cbm-2',
            type: 'fill',
            question: 'Add 20px of outer space around a card element using margin:',
            hint: 'margin creates space outside the element border.',
            code: ['.card', '{', 'margin', ':', '20px', ';', '}'],
            blanks: [2, 4],
            options: ['margin', '20px', 'padding', '10px', 'border', 'spacing'],
            correct: ['margin', '20px'],
            explanation: 'margin: 20px creates outer separation from neighboring elements.'
          }
        ]
      },
      {
        id: 'css-selectors',
        title: 'Selectors, Classes & IDs',
        description: 'Target specific elements using class and ID selectors.',
        exercises: [
          {
            id: 'cs-1',
            type: 'fill',
            question: 'In CSS, which symbol is used to target a class named "btn"?',
            hint: 'Classes start with a period (.) in CSS.',
            code: ['.', 'btn', '{', 'background: blue;', '}'],
            blanks: [0],
            options: ['.', '#', '@', '$', '*'],
            correct: ['.'],
            explanation: 'The dot (.) prefix targets reusable HTML classes.'
          },
          {
            id: 'cs-2',
            type: 'create',
            question: 'Write the ID selector in CSS for a unique element with id="header":',
            hint: 'IDs are prefixed with a hash symbol (#).',
            placeholder: '#header',
            starterCode: '/* Target unique ID */\n... {\n  background: darkblue;\n}',
            options: [],
            correct: ['#header', '#header {'],
            explanation: '#header selects the unique element on the page with id="header".'
          },
          {
            id: 'cs-3',
            type: 'choice',
            question: 'Which selector targets all <p> elements inside an element with class "container"?',
            hint: 'Use a space for descendant selectors: .parent child',
            options: ['.container p', '.container.p', '.container + p', '.container > p.all'],
            correct: ['.container p'],
            explanation: '.container p is a descendant selector matching all paragraphs nested inside .container.'
          }
        ]
      },
      {
        id: 'css-typography',
        title: 'Fonts & Typography',
        description: 'Configure font-family, font-size, line-height, and font-weight.',
        exercises: [
          {
            id: 'ct-1',
            type: 'fill',
            question: 'Set the font size to 24 pixels and make the text bold in CSS:',
            hint: 'font-size controls scale; font-weight controls thickness.',
            code: ['h2', '{', 'font-size', ': 24px;', 'font-weight', ': bold;', '}'],
            blanks: [2, 4],
            options: ['font-size', 'font-weight', 'text-size', 'text-weight', 'line-height', 'boldness'],
            correct: ['font-size', 'font-weight'],
            explanation: 'font-size: 24px sets scale; font-weight: bold sets thick strokes.'
          },
          {
            id: 'ct-2',
            type: 'create',
            question: 'Write the relative CSS unit based on the font size of the root <html> element:',
            hint: 'Root EM unit.',
            placeholder: 'rem',
            starterCode: 'p {\n  font-size: 1.25...;\n}',
            options: [],
            correct: ['rem'],
            explanation: 'rem scales proportionally to root font-size, delivering excellent accessibility.'
          }
        ]
      },
      {
        id: 'css-display',
        title: 'Display & Positioning',
        description: 'Control element flow with block, inline-block, relative, and absolute.',
        exercises: [
          {
            id: 'cd-1',
            type: 'create',
            question: 'Write the display value that completely hides an element from the page:',
            hint: 'display: none removes the element completely from rendering.',
            placeholder: 'none',
            starterCode: '.hidden-dialog {\n  display: ...;\n}',
            options: [],
            correct: ['none', 'display: none;', 'display: none'],
            explanation: 'display: none removes the element from rendering as if it does not exist.'
          },
          {
            id: 'cd-2',
            type: 'fill',
            question: 'Position an overlay element relative to its nearest positioned ancestor:',
            hint: 'position: absolute removes element from flow and anchors it to parent.',
            code: ['.badge', '{', 'position', ':', 'absolute', ';', 'top', ': 0;', '}'],
            blanks: [2, 4],
            options: ['position', 'absolute', 'relative', 'fixed', 'display', 'float'],
            correct: ['position', 'absolute'],
            explanation: 'position: absolute coordinates elements precisely relative to positioned ancestors.'
          }
        ]
      },
      {
        id: 'css-flexbox',
        title: 'Modern Flexbox Layouts',
        description: 'Align and distribute elements effortlessly with flex containers.',
        exercises: [
          {
            id: 'cf-1',
            type: 'fill',
            question: 'Turn a container into a flexbox and center items horizontally:',
            hint: 'display: flex activates flexbox; justify-content: center centers on main axis.',
            code: ['.nav', '{', 'display', ':', 'flex', ';', 'justify-content', ':', 'center', ';', '}'],
            blanks: [4, 8],
            options: ['flex', 'center', 'block', 'left', 'grid', 'inline'],
            correct: ['flex', 'center'],
            explanation: 'display: flex with justify-content: center centers items horizontally.'
          },
          {
            id: 'cf-2',
            type: 'choice',
            question: 'Which property aligns flex items along the cross axis (vertically)?',
            hint: 'justify-content handles main axis; align-items handles cross axis.',
            options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
            correct: ['align-items'],
            explanation: 'align-items aligns children along the cross axis (vertically in row layouts).'
          },
          {
            id: 'cf-3',
            type: 'create',
            question: 'Write the CSS property used to create uniform space between flex children without margins:',
            hint: 'The modern spacing property is gap.',
            placeholder: 'gap',
            starterCode: '.flex-container {\n  display: flex;\n  ...: 16px;\n}',
            options: [],
            correct: ['gap', 'gap:', 'gap: 16px;', 'gap: 16px'],
            explanation: 'gap: 16px creates clean gutters between flex children without margins.'
          }
        ]
      },
      {
        id: 'css-grid',
        title: 'CSS Grid System',
        description: 'Design 2-dimensional layouts with rows and columns.',
        exercises: [
          {
            id: 'cg-1',
            type: 'fill',
            question: 'Create a 3-column equal grid using repeat() and fractional units:',
            hint: 'grid-template-columns: repeat(3, 1fr) creates 3 equal columns.',
            code: ['.grid', '{', 'grid-template-columns', ':', 'repeat', '(', '3', ',', '1fr', ');', '}'],
            blanks: [4, 6],
            options: ['repeat', '3', 'span', '1fr', 'auto', '4'],
            correct: ['repeat', '3'],
            explanation: 'repeat(3, 1fr) divides available grid width into three equal fractional columns.'
          },
          {
            id: 'cg-2',
            type: 'create',
            question: 'Write the display value that activates 2-dimensional CSS grid on a container:',
            hint: 'display: grid',
            placeholder: 'grid',
            starterCode: '.photo-gallery {\n  display: ...;\n}',
            options: [],
            correct: ['grid', 'display: grid;', 'display: grid'],
            explanation: 'display: grid activates 2-dimensional grid positioning for rows and columns.'
          }
        ]
      },
      {
        id: 'css-responsive',
        title: 'Responsive Design & Media Queries',
        description: 'Adapt styles seamlessly for mobile, tablet, and desktop screens.',
        exercises: [
          {
            id: 'cr-1',
            type: 'fill',
            question: 'Write a media query that applies styles when the screen is 768px or wider:',
            hint: '@media (min-width: 768px) is the standard tablet/desktop breakpoint.',
            code: ['@media', '(min-width:', '768px', ')', '{', 'body', '{ font-size: 18px; }', '}'],
            blanks: [0, 2],
            options: ['@media', '768px', '@screen', '1024px', '@query', '480px'],
            correct: ['@media', '768px'],
            explanation: '@media (min-width: 768px) adapts typography and layouts for larger screens.'
          },
          {
            id: 'cr-2',
            type: 'create',
            question: 'Write the CSS at-rule symbol and keyword used to begin a responsive media query:',
            hint: 'Starts with @ followed by media.',
            placeholder: '@media',
            starterCode: '... (max-width: 600px) {\n  .sidebar { display: none; }\n}',
            options: [],
            correct: ['@media'],
            explanation: '@media queries allow styling rules to execute conditionally based on viewport size.'
          }
        ]
      },
      {
        id: 'css-boss',
        title: 'CSS Styling Master Boss',
        isBoss: true,
        description: 'Prove your frontend styling mastery in this comprehensive challenge.',
        exercises: [
          {
            id: 'cb-1',
            type: 'fill',
            question: 'Build a modern responsive card with smooth rounded corners and animated transition:',
            hint: 'border-radius rounds corners; transition animates state changes.',
            code: ['.card', '{', 'border-radius', ': 12px;', 'transition', ': all 0.3s;', '}'],
            blanks: [2, 4],
            options: ['border-radius', 'transition', 'corner-radius', 'animation', 'transform', 'box-shadow'],
            correct: ['border-radius', 'transition'],
            explanation: 'border-radius rounds corners, while transition provides fluid hover feedback.'
          },
          {
            id: 'cb-2',
            type: 'choice',
            question: 'Which property creates a hover pseudo-class selector in CSS?',
            hint: 'Pseudo-classes begin with a colon, like :hover.',
            options: ['.card:hover', '.card.hover', '.card::hover', '.card->hover'],
            correct: ['.card:hover'],
            explanation: ':hover activates when the user moves their mouse pointer over an element.'
          },
          {
            id: 'cb-3',
            type: 'create',
            question: 'In a flex container, write the property and value to center items along the main axis:',
            hint: 'justify-content: center;',
            placeholder: 'justify-content: center;',
            starterCode: '.hero-banner {\n  display: flex;\n  ...\n}',
            options: [],
            correct: ['justify-content: center;', 'justify-content: center', 'justify-content:center;'],
            explanation: 'justify-content: center centers flex children horizontally in standard row mode.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 3: PHP SERVER LOGIC ---
  // ==========================================
  {
    id: 'php-1',
    title: 'PHP: Server-Side Logic & APIs',
    subtitle: 'Module 3 (Advanced)',
    description: 'Master backend variables, conditionals, arrays, and backend form handling.',
    isAdvanced: true,
    lessons: [
      {
        id: 'php-syntax',
        title: 'PHP Syntax & Output',
        description: 'Open PHP tags, echo messages, and statements ending in semicolons.',
        exercises: [
          {
            id: 'ps-1',
            type: 'create',
            question: 'Write the complete opening tag for a PHP script block:',
            hint: 'PHP blocks open with <?php.',
            placeholder: '<?php',
            starterCode: '...\necho "Hello Server World!";\n?>',
            options: [],
            correct: ['<?php', '<?php '],
            explanation: '<?php tells the web server engine to interpret the following lines as PHP script.'
          },
          {
            id: 'ps-2',
            type: 'fill',
            question: 'Output text to the browser using the echo statement and mandatory semicolon:',
            hint: 'echo outputs strings; statements end in a semicolon (;).',
            code: ['<?php', 'echo', '"Hello CodeQuest"', ';', '?>'],
            blanks: [1, 3],
            options: ['echo', ';', 'print_line', ':', 'out', '.'],
            correct: ['echo', ';'],
            explanation: 'echo outputs data to the client; the semicolon is mandatory to terminate statements.'
          }
        ]
      },
      {
        id: 'php-variables',
        title: 'PHP Variables',
        description: 'Store strings, numbers, and state in variables.',
        exercises: [
          {
            id: 'pv-1',
            type: 'fill',
            question: 'All PHP variables must start with which character and be assigned with equals:',
            hint: 'Variables start with $ (e.g. $score = 100).',
            code: ['<?php', '$', 'score', '=', '100', ';', '?>'],
            blanks: [1, 3],
            options: ['$', '=', '#', ':=', '@', '->'],
            correct: ['$', '='],
            explanation: 'PHP variables always start with $ and are assigned with single equals =.'
          },
          {
            id: 'pv-2',
            type: 'create',
            question: 'All PHP variable names must begin with which special character?',
            hint: 'The dollar sign symbol.',
            placeholder: '$',
            starterCode: '...student_name = "Alex";',
            options: [],
            correct: ['$', '\\$'],
            explanation: 'The dollar sign ($) is required at the beginning of every PHP variable name.'
          }
        ]
      },
      {
        id: 'php-conditionals',
        title: 'Conditionals & Logic',
        description: 'Direct code execution using if, elseif, and else statements.',
        exercises: [
          {
            id: 'pc-1',
            type: 'fill',
            question: 'Check if a user is logged in before greeting them in PHP:',
            hint: 'if evaluates a condition; else provides the fallback branch.',
            code: ['if', '($isLoggedIn)', '{ echo "Welcome"; }', 'else', '{ echo "Log In"; }'],
            blanks: [0, 3],
            options: ['if', 'else', 'when', 'otherwise', 'case', 'then'],
            correct: ['if', 'else'],
            explanation: 'if ($condition) executes when true, falling back to else when false.'
          },
          {
            id: 'pc-2',
            type: 'create',
            question: 'Write the strict comparison operator that checks equal value AND identical data type in PHP:',
            hint: 'Strict equality uses three equals signs: ===',
            placeholder: '===',
            starterCode: 'if ($score ... 100) {\n  echo "Perfect Score!";\n}',
            options: [],
            correct: ['==='],
            explanation: '=== checks both value and type, preventing unexpected type-juggling bugs in PHP.'
          }
        ]
      },
      {
        id: 'php-arrays',
        title: 'Arrays & Dictionaries',
        description: 'Store lists of data and associative key-value dictionaries.',
        exercises: [
          {
            id: 'pa-1',
            type: 'fill',
            question: 'Create an array with three programming languages in PHP:',
            hint: 'Modern PHP arrays are defined using square brackets [].',
            code: ['$languages', '=', '[', '"HTML", "CSS", "PHP"', ']', ';'],
            blanks: [2, 4],
            options: ['[', ']', '{', '}', '(', ')'],
            correct: ['[', ']'],
            explanation: 'Square brackets [ ... ] create modern indexed or associative arrays in PHP.'
          },
          {
            id: 'pa-2',
            type: 'fill',
            question: 'In an associative array, which operator associates keys with values?',
            hint: 'The fat arrow operator => binds keys to values.',
            code: ['$user = [', '"name"', '=>', '"Sam",', '"role"', '=>', '"Admin"', '];'],
            blanks: [2, 5],
            options: ['=>', '=>', '->', '->', ':', '='],
            correct: ['=>', '=>'],
            explanation: 'The fat arrow => associates each key with its corresponding value in an array.'
          }
        ]
      },
      {
        id: 'php-loops',
        title: 'Foreach Loops',
        description: 'Iterate over collections of items and print dynamic HTML.',
        exercises: [
          {
            id: 'pl-1',
            type: 'fill',
            question: 'Loop through a list of skills using foreach in PHP:',
            hint: 'foreach ($array as $item) iterates through array elements.',
            code: ['foreach', '($skills as', '$skill', ')', '{ echo $skill; }'],
            blanks: [0, 2],
            options: ['foreach', '$skill', 'for', '$skills', 'loop', 'each'],
            correct: ['foreach', '$skill'],
            explanation: 'foreach ($skills as $skill) loops through each element sequentially.'
          },
          {
            id: 'pl-2',
            type: 'create',
            question: 'Write the built-in PHP function used to count the total number of items in an array:',
            hint: 'count() returns the integer length of an array.',
            placeholder: 'count()',
            starterCode: '$total = ...($skills);',
            options: [],
            correct: ['count()', 'count', 'count($skills)'],
            explanation: 'count() returns the number of elements in an array.'
          }
        ]
      },
      {
        id: 'php-functions',
        title: 'Custom Functions',
        description: 'Encapsulate reusable logic with function arguments and return values.',
        exercises: [
          {
            id: 'pf-1',
            type: 'fill',
            question: 'Define a function that calculates total XP with a bonus in PHP:',
            hint: 'Functions are declared with function and return values with return.',
            code: ['function', 'addXp($base, $bonus)', '{', 'return', '$base + $bonus;', '}'],
            blanks: [0, 3],
            options: ['function', 'return', 'def', 'output', 'fn', 'send'],
            correct: ['function', 'return'],
            explanation: 'function declares the reusable routine; return sends computed results back.'
          },
          {
            id: 'pf-2',
            type: 'create',
            question: 'Write the single character operator used to concatenate strings together in PHP:',
            hint: 'In PHP, strings are joined with a period (.) operator.',
            placeholder: '.',
            starterCode: '$greeting = "Hello " ... $username;',
            options: [],
            correct: ['.', '.(period)', 'period', '.'],
            explanation: 'In PHP, the period (.) operator joins strings together (unlike + in JS/Python).'
          }
        ]
      },
      {
        id: 'php-forms',
        title: 'Form Handling & Security',
        description: 'Access submitted form data and sanitize user inputs against XSS.',
        exercises: [
          {
            id: 'pform-1',
            type: 'fill',
            question: 'Retrieve submitted data from a POST form superglobal array:',
            hint: '$_POST is the superglobal array holding form inputs.',
            code: ['$email', '=', '$_POST', '[', '"email"', ']', ';'],
            blanks: [2, 4],
            options: ['$_POST', '"email"', '$_GET', '"user"', '$POST', '"data"'],
            correct: ['$_POST', '"email"'],
            explanation: '$_POST["field_name"] accesses parameters submitted through HTTP POST forms.'
          },
          {
            id: 'pform-2',
            type: 'create',
            question: 'Write the built-in PHP function used to sanitize user input and prevent XSS attacks:',
            hint: 'Short for HTML Special Characters.',
            placeholder: 'htmlspecialchars()',
            starterCode: '$safe_comment = ...($comment);',
            options: [],
            correct: ['htmlspecialchars()', 'htmlspecialchars', 'htmlspecialchars($comment)'],
            explanation: 'htmlspecialchars() neutralizes <, >, &, and quotes to eliminate Cross-Site Scripting (XSS).'
          }
        ]
      },
      {
        id: 'php-boss',
        title: 'Backend PHP Boss Challenge',
        isBoss: true,
        description: 'Test your backend logic, superglobals, and data handling in the final exam.',
        exercises: [
          {
            id: 'pb-1',
            type: 'fill',
            question: 'Validate whether a user input variable is empty before saving:',
            hint: 'empty() checks if a variable is unset or falsy.',
            code: ['if', '(', 'empty', '($username))', '{ echo "Required!"; }'],
            blanks: [2],
            options: ['empty', 'null', 'blank', 'zero', 'missing'],
            correct: ['empty'],
            explanation: 'empty() safely checks whether a variable has a valid non-empty value.'
          },
          {
            id: 'pb-2',
            type: 'choice',
            question: 'Where is PHP code executed when a user visits a web page?',
            hint: 'PHP is a server-side language.',
            options: [
              'On the web server before the response is sent to the client browser',
              'Inside the visitor\'s Google Chrome browser',
              'In the local operating system kernel',
              'Inside the CSS stylesheet renderer'
            ],
            correct: ['On the web server before the response is sent to the client browser'],
            explanation: 'PHP runs entirely on the web server; browsers only receive the final generated output.'
          },
          {
            id: 'pb-3',
            type: 'create',
            question: 'Complete the statement that outputs the user variable using echo:',
            hint: 'echo $username;',
            placeholder: 'echo $username;',
            starterCode: '$username = "MasterDev";\n...',
            options: [],
            correct: ['echo $username;', 'echo $username', 'echo $username ;'],
            explanation: 'echo $username; sends the stored variable value directly to the output stream.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 4 (ADVANCED): MODERN REACT & STATE ARCHITECTURE ---
  // ==========================================
  {
    id: 'react-adv',
    title: 'React Architecture & State Mastery',
    subtitle: 'Advance Module 4',
    description: 'Master component composition, JSX reconciliation, custom hooks, and state reducers.',
    isAdvanced: true,
    lessons: [
      {
        id: 'react-components-props',
        title: 'React JSX & Component Props',
        description: 'Construct reusable UI components and enforce strict unidirectional data flow.',
        exercises: [
          {
            id: 'rcp-1',
            type: 'choice',
            question: 'How do React components pass data down to their child components?',
            hint: 'Data is passed unidirectionally from parent to child.',
            options: ['Via read-only props', 'By modifying global window objects', 'Through two-way DOM mirrors', 'Using SQL queries'],
            correct: ['Via read-only props'],
            explanation: 'React uses read-only props to pass immutable data downwards in a component hierarchy.'
          },
          {
            id: 'rcp-2',
            type: 'fill',
            question: 'Create a functional React component that accepts a title prop:',
            hint: 'function Card({ title }) { return <h1>{title}</h1>; }',
            code: ['function', 'Card({ title })', '{ return', '<h1>{title}</h1>', '; }'],
            blanks: [0, 3],
            options: ['function', '<h1>{title}</h1>', 'class', 'render', '<title>', 'export'],
            correct: ['function', '<h1>{title}</h1>'],
            explanation: 'Functional components accept props destructured in parameters and return JSX.'
          },
          {
            id: 'rcp-3',
            type: 'create',
            question: 'Write a JSX element that renders a UserProfile component with a username prop set to "Alex":',
            hint: '<UserProfile username="Alex" />',
            placeholder: '<UserProfile username="Alex" />',
            starterCode: '// Render the UserProfile component with prop\n...',
            options: [],
            correct: ['<UserProfile username="Alex" />', '<UserProfile username="Alex"/>', '<UserProfile username=\'Alex\' />', '<UserProfile username=\'Alex\'/>'],
            explanation: '<UserProfile username="Alex" /> renders the component passing the username string prop.'
          }
        ]
      },
      {
        id: 'react-hooks-state',
        title: 'useState & useEffect Lifecycles',
        description: 'Manage local component state and handle asynchronous side effects cleanly.',
        exercises: [
          {
            id: 'rhs-1',
            type: 'fill',
            question: 'Initialize a state hook for counter starting at 0:',
            hint: 'const [count, setCount] = useState(0);',
            code: ['const', '[count, setCount]', '=', 'useState', '(0);'],
            blanks: [1, 3],
            options: ['[count, setCount]', 'useState', 'setState', '[count]', 'useEffect', 'useReducer'],
            correct: ['[count, setCount]', 'useState'],
            explanation: 'useState(initialValue) returns the current state and a dispatcher function.'
          },
          {
            id: 'rhs-2',
            type: 'choice',
            question: 'When does a useEffect hook run if its dependency array is empty ([])?',
            hint: 'It simulates componentDidMount in class components.',
            options: [
              'Only once when the component initially mounts',
              'On every single re-render of the component',
              'Only when the component is unmounted',
              'Whenever any parent state changes'
            ],
            correct: ['Only once when the component initially mounts'],
            explanation: 'An empty dependency array ([]) ensures the effect only runs once after initial mount.'
          },
          {
            id: 'rhs-3',
            type: 'create',
            question: 'Write the call to update count by 1 using the setter setCount:',
            hint: 'setCount(count + 1) or setCount(c => c + 1)',
            placeholder: 'setCount(count + 1)',
            starterCode: 'const [count, setCount] = useState(0);\n// Increment count by 1\n...',
            options: [],
            correct: ['setCount(count + 1)', 'setCount(c => c + 1)', 'setCount(prev => prev + 1)', 'setCount(count + 1);'],
            explanation: 'setCount(count + 1) schedules a state update triggering a re-render.'
          }
        ]
      },
      {
        id: 'react-boss',
        title: 'React Architecture Boss Challenge',
        isBoss: true,
        description: 'Prove your frontend mastery by diagnosing re-renders and composing state patterns.',
        exercises: [
          {
            id: 'rb-1',
            type: 'choice',
            question: 'Why must you provide a unique "key" prop when rendering dynamic lists in React?',
            hint: 'It helps React identify which items have changed, added, or removed.',
            options: [
              'To help React reconciliation algorithm track item identity across re-renders',
              'To enable CSS styling on the elements',
              'To encrypt DOM tree nodes for security',
              'To create automatic database primary keys'
            ],
            correct: ['To help React reconciliation algorithm track item identity across re-renders'],
            explanation: 'Keys give elements a stable identity so React can efficiently mutate the real DOM.'
          },
          {
            id: 'rb-2',
            type: 'fill',
            question: 'Create a memoized callback to prevent unnecessary child re-renders:',
            hint: 'const handleClick = useCallback(() => { ... }, [id]);',
            code: ['const handleClick =', 'useCallback', '(() => { doAction(id); }, [', 'id', ']);'],
            blanks: [1, 3],
            options: ['useCallback', 'id', 'useMemo', 'useEffect', 'props', 'state'],
            correct: ['useCallback', 'id'],
            explanation: 'useCallback memoizes callback functions until dependencies change.'
          },
          {
            id: 'rb-3',
            type: 'create',
            question: 'Write the syntax to export a custom hook named useAuth:',
            hint: 'export function useAuth() { ... }',
            placeholder: 'export function useAuth()',
            starterCode: '// Export custom hook function\n...',
            options: [],
            correct: ['export function useAuth()', 'export function useAuth() {}', 'export const useAuth = () =>'],
            explanation: 'export function useAuth() declares and exports a reusable custom hook.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // --- MODULE 5 (ADVANCED): NEXT.JS & WEB SECURITY ---
  // ==========================================
  {
    id: 'nextjs-adv',
    title: 'Next.js App Router & Web Security',
    subtitle: 'Advance Module 5',
    description: 'Build production-ready full-stack web applications with SSR, Server Actions, and XSS/CSRF hardening.',
    isAdvanced: true,
    lessons: [
      {
        id: 'nextjs-server-actions',
        title: 'React Server Components & Server Actions',
        description: 'Execute backend code directly from UI components with zero client bundle overhead.',
        exercises: [
          {
            id: 'nsa-1',
            type: 'choice',
            question: 'What directive declares a function as a Next.js Server Action running on the backend?',
            hint: 'It is a string directive placed at the top of the function or file.',
            options: ['"use server"', '"use client"', '"use backend"', '"server only"'],
            correct: ['"use server"'],
            explanation: '"use server" instructs the Next.js compiler to expose the function as a secure RPC endpoint.'
          },
          {
            id: 'nsa-2',
            type: 'fill',
            question: 'Declare a Server Action in Next.js:',
            hint: 'async function createPost(formData) { "use server"; ... }',
            code: ['async function createPost(formData) {', '\n  "use server";', '\n  await db.insert(formData);', '\n}'],
            blanks: [1],
            options: ['"use server";', '"use client";', '"use api";', '"use action";'],
            correct: ['"use server";'],
            explanation: '"use server" marks async backend logic inside Next.js App Router.'
          },
          {
            id: 'nsa-3',
            type: 'create',
            question: 'Write the directive to designate an interactive React component that uses hooks in Next.js:',
            hint: '"use client"',
            placeholder: '"use client";',
            starterCode: '// Top of client-side component file\n...',
            options: [],
            correct: ['"use client";', '"use client"', "'use client';", "'use client'"],
            explanation: '"use client" marks boundary for interactive client components in Next.js.'
          }
        ]
      },
      {
        id: 'web-security-xss-csrf',
        title: 'Web Security: XSS, CSRF & CSP',
        description: 'Harden web applications against malicious script injection and cross-origin forgery.',
        exercises: [
          {
            id: 'ws-1',
            type: 'choice',
            question: 'What does Content Security Policy (CSP) do in a modern web browser?',
            hint: 'It restricts which scripts and origins are permitted to execute.',
            options: [
              'Restricts the sources from which scripts, styles, and assets can be loaded to prevent XSS',
              'Encrypts local SQLite databases on the user computer',
              'Forces users to use two-factor authentication',
              'Compresses PNG image payloads'
            ],
            correct: ['Restricts the sources from which scripts, styles, and assets can be loaded to prevent XSS'],
            explanation: 'CSP headers tell the browser which dynamic scripts and resources are trusted.'
          },
          {
            id: 'ws-2',
            type: 'fill',
            question: 'Protect cookies from client-side JavaScript access to prevent token theft:',
            hint: 'Set the httpOnly and secure flags on authentication cookies.',
            code: ['res.cookie("session_token", token, {', 'httpOnly:', 'true,', 'secure:', 'true });'],
            blanks: [1, 3],
            options: ['httpOnly:', 'secure:', 'readOnly:', 'noScript:', 'cors:', 'public:'],
            correct: ['httpOnly:', 'secure:'],
            explanation: 'httpOnly prevents document.cookie access from XSS, and secure enforces HTTPS transmission.'
          },
          {
            id: 'ws-3',
            type: 'create',
            question: 'What cookie attribute prevents Cross-Site Request Forgery (CSRF) by blocking third-party requests?',
            hint: 'SameSite=Strict or SameSite=Lax',
            placeholder: 'SameSite=Strict',
            starterCode: '// Set SameSite cookie policy\nsameSite: "..."',
            options: [],
            correct: ['SameSite=Strict', 'sameSite: "strict"', 'sameSite: "lax"', 'strict', 'Strict'],
            explanation: 'SameSite=Strict stops the browser from sending cookies on cross-origin navigation.'
          }
        ]
      },
      {
        id: 'fullstack-boss',
        title: 'Full-Stack Web Architect Boss Challenge',
        isBoss: true,
        description: 'Prove full mastery over modern full-stack web engineering and enterprise architecture.',
        exercises: [
          {
            id: 'fsb-1',
            type: 'choice',
            question: 'What is the primary benefit of React Server Components (RSC)?',
            hint: 'They render on the server and send zero JS bundle for those components to the client.',
            options: [
              'Zero client-side JavaScript footprint for static dependencies and direct backend database access',
              'They automatically generate mobile native APKs',
              'They bypass all CSS stylesheets',
              'They eliminate the need for an internet connection'
            ],
            correct: ['Zero client-side JavaScript footprint for static dependencies and direct backend database access'],
            explanation: 'RSC delivers lightning fast page loads with instant data fetching and minimal client JS.'
          },
          {
            id: 'fsb-2',
            type: 'fill',
            question: 'Revalidate cached data on demand in Next.js:',
            hint: 'revalidatePath("/dashboard");',
            code: ['import {', 'revalidatePath', '} from "next/cache";\n', 'revalidatePath', '("/dashboard");'],
            blanks: [1, 3],
            options: ['revalidatePath', 'revalidatePath', 'refreshCache', 'purgeCache', 'revalidateTag'],
            correct: ['revalidatePath', 'revalidatePath'],
            explanation: 'revalidatePath() purges the server cache for a specific route on demand.'
          },
          {
            id: 'fsb-3',
            type: 'create',
            question: 'Write the command or method to sanitize untrusted HTML string to prevent XSS:',
            hint: 'DOMPurify.sanitize(input)',
            placeholder: 'DOMPurify.sanitize(input)',
            starterCode: '// Sanitize raw HTML string before rendering\nconst cleanHtml = ...;',
            options: [],
            correct: ['DOMPurify.sanitize(input)', 'DOMPurify.sanitize(html)', 'DOMPurify.sanitize(rawHtml)'],
            explanation: 'DOMPurify.sanitize(input) strips malicious tags and event listeners.'
          }
        ]
      }
    ]
  }
];
