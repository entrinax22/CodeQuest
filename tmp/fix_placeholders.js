const fs = require('fs');

const files = [
  'src/data/curriculum.ts',
  'src/data/paths/pythonCurriculum.ts',
  'src/data/paths/javaCurriculum.ts',
  'src/data/paths/cppCurriculum.ts',
  'src/data/paths/backendCurriculum.ts',
  'src/data/paths/devopsCurriculum.ts'
];

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('placeholder:') && !line.includes('Type your username') && !line.includes('Enter password')) {
      replacedCount++;
      if (file.includes('python')) {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., print(...) or statement'");
      } else if (file.includes('java')) {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., System.out.println(...) or statement'");
      } else if (file.includes('cpp')) {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., std::cout << ... or statement'");
      } else if (file.includes('backend')) {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., HTTP method, SQL query, or syntax'");
      } else if (file.includes('devops')) {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., command --flag or syntax'");
      } else {
        return line.replace(/placeholder:\s*['"].*?['"]/, "placeholder: 'e.g., <tagname> or syntax'");
      }
    }
    return line;
  });

  fs.writeFileSync(file, newLines.join('\n'), 'utf8');
});

console.log(`Updated ${replacedCount} spoiled placeholders across all curriculum files.`);
