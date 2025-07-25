// playgroundFunctions.js

// Utility to add styled log lines
function addLog(outputEl, lines) {
  lines.forEach(({ content, type = 'log', indent = 0 }) => {
    const p = document.createElement('p');
    p.className = `console-${type}` + (indent ? ` pl-${indent}` : '');
    p.textContent = content;
    outputEl.appendChild(p);
  });
}

// Runtime logic for each console method
const countMap = new Map();

const methodRunners = {
  log: (outputEl) => {
    const name = 'Alice';
    const age = 30;
    addLog(outputEl, [
      { content: `> console.log("Name:", "${name}", "Age:", ${age})` },
      { content: `Name: Alice Age: 30` },
    ]);
  },
  warn: (outputEl) => {
    const msg = 'This function is deprecated.';
    addLog(outputEl, [
      { content: `> console.warn("${msg}")` },
      { content: msg, type: 'warn' },
    ]);
  },
  error: (outputEl) => {
    const msg = 'Error: API connection failed.';
    addLog(outputEl, [
      { content: `> console.error("${msg}")` },
      { content: msg, type: 'error' },
    ]);
  },
  info: (outputEl) => {
    const msg = 'Application initialized successfully.';
    addLog(outputEl, [
      { content: `> console.info("${msg}")` },
      { content: msg, type: 'info' },
    ]);
  },
  debug: (outputEl) => {
    const msg = 'Debugging component render cycle...';
    addLog(outputEl, [
      { content: `> console.debug("${msg}")` },
      { content: msg, type: 'debug' },
    ]);
  },
  clear: (outputEl) => {
    outputEl.innerHTML = '';
    addLog(outputEl, [
      { content: `> console.clear()` },
      { content: 'Console Cleared.', type: 'log' },
    ]);
  },
  table: (outputEl) => {
    const users = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
    ];
    addLog(outputEl, [{ content: '> console.table(users)' }]);

    const table = document.createElement('table');
    table.className = 'console-table';

    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['(index)', 'id', 'name', 'role'].forEach((key) => {
      const th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    users.forEach((user, i) => {
      const row = tbody.insertRow();
      row.innerHTML = `<td>${i}</td><td>${user.id}</td><td>${user.name}</td><td>${user.role}</td>`;
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'console-table';
    wrapper.appendChild(table);
    outputEl.appendChild(wrapper);
  },
  dir: (outputEl) => {
    const obj = {
      config: { theme: 'dark', version: '1.2' },
      data: [1, 2],
    };
    addLog(outputEl, [
      { content: '> console.dir(myObject)' },
      { content: JSON.stringify(obj, null, 2), type: 'log' },
    ]);
  },
  count: (outputEl) => {
    const label = 'render';
    const count = (countMap.get(label) || 0) + 1;
    countMap.set(label, count);
    addLog(outputEl, [
      { content: `> console.count("${label}")` },
      { content: `${label}: ${count}` },
    ]);
  },
  time: (outputEl) => {
    const duration = (Math.random() * 50 + 20).toFixed(2);
    addLog(outputEl, [
      { content: `> console.time("Task A")` },
      { content: '> // ...some task...' },
      { content: `> console.timeEnd("Task A")` },
      { content: `Task A: ${duration}ms` },
    ]);
  },
  trace: (outputEl) => {
    addLog(outputEl, [
      { content: '> console.trace("Trace from here")' },
      {
        content:
          'Trace: Trace from here\n    at run (index.html:300)\n    at HTMLButtonElement.onclick (index.html:250)',
        type: 'log',
      },
    ]);
  },
  group: (outputEl) => {
    addLog(outputEl, [
      { content: '> console.group("User Details")' },
      { content: '> console.log("Name: John")', indent: 4 },
      { content: 'Name: John', indent: 4 },
      { content: '> console.log("Email: john@dev.com")', indent: 4 },
      { content: 'Email: john@dev.com', indent: 4 },
      { content: '> console.groupEnd()' },
    ]);
  },
  assert: (outputEl) => {
    addLog(outputEl, [
      { content: '> const x = 5;' },
      {
        content:
          '> console.assert(x < 3, "Assertion failed: x is not less than 3")',
      },
      {
        content: 'Assertion failed: x is not less than 3',
        type: 'error',
      },
    ]);
  },
};

// Loads consoleMethods from JSON and attaches run logic
export async function loadConsoleMethods() {
  const response = await fetch('js/consoleMethods.json');
  const methods = await response.json();

  for (const key in methods) {
    if (methodRunners[key]) {
      methods[key].run = methodRunners[key];
    } else {
      methods[key].run = (outputEl) => {
        addLog(outputEl, [
          { content: `> console.${key}() — no runner yet`, type: 'warn' },
        ]);
      };
    }
  }

  return methods;
}

// Playground UI logic (to be imported in main.js)
export function setupPlayground(methods) {
  const selector = document.getElementById('method-selector');
  const nameEl = document.getElementById('method-name');
  const useCaseEl = document.getElementById('method-usecase');
  const syntaxEl = document.getElementById('method-syntax');
  const runButton = document.getElementById('run-button');
  const clearButton = document.getElementById('clear-button');
  const outputEl = document.getElementById('console-output');

  Object.keys(methods).forEach((key) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = methods[key].name;
    selector.appendChild(option);
  });

  function updateDetails(key) {
    const method = methods[key];
    nameEl.textContent = method.name;
    useCaseEl.textContent = method.useCase;
    syntaxEl.textContent = method.syntax;
  }

  selector.addEventListener('change', (e) => {
    updateDetails(e.target.value);
  });

  runButton.addEventListener('click', () => {
    outputEl.innerHTML = '';
    const selectedKey = selector.value;
    methods[selectedKey].run(outputEl);
    outputEl.scrollTop = outputEl.scrollHeight;
  });

  clearButton.addEventListener('click', () => {
    outputEl.innerHTML =
      '<p class="text-gray-500">Click "Run Example" to see output here...</p>';
    countMap.clear();
  });

  updateDetails(Object.keys(methods)[0]);
}
