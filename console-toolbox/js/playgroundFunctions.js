// Functions for playground interactivity

// Loads consoleMethods from JSON and attaches run logic
export async function loadConsoleMethods() {
  const response = await fetch('js/consoleMethods.json');
  const methods = await response.json();

  // Attach run logic for each method
  methods.log.run = (outputEl) => {
    const name = 'Alice';
    const age = 30;
    outputEl.innerHTML += `<p class="console-log">> console.log(\"Name:\", \"${name}\", \"Age:\", ${age})</p>`;
    outputEl.innerHTML += `<p class="console-log">Name: Alice Age: 30</p>`;
  };
  methods.warn.run = (outputEl) => {
    const msg = 'This function is deprecated.';
    outputEl.innerHTML += `<p class="console-log">> console.warn(\"${msg}\")</p>`;
    outputEl.innerHTML += `<p class="console-warn">${msg}</p>`;
  };
  methods.error.run = (outputEl) => {
    const msg = 'Error: API connection failed.';
    outputEl.innerHTML += `<p class="console-log">> console.error(\"${msg}\")</p>`;
    outputEl.innerHTML += `<p class="console-error">${msg}</p>`;
  };
  methods.info.run = (outputEl) => {
    const msg = 'Application initialized successfully.';
    outputEl.innerHTML += `<p class="console-log">> console.info(\"${msg}\")</p>`;
    outputEl.innerHTML += `<p class="console-info">${msg}</p>`;
  };
  methods.debug.run = (outputEl) => {
    const msg = 'Debugging component render cycle...';
    outputEl.innerHTML += `<p class="console-log">> console.debug(\"${msg}\")</p>`;
    outputEl.innerHTML += `<p class="console-debug">${msg}</p>`;
  };
  methods.clear.run = (outputEl) => {
    outputEl.innerHTML = `<p class=\"console-log\">> console.clear()</p>`;
    outputEl.innerHTML += `<p class=\"text-gray-500\">Console Cleared.</p>`;
  };
  methods.table.run = (outputEl) => {
    const users = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
    ];
    outputEl.innerHTML += `<p class=\"console-log\">> console.table(users)</p>`;
    let tableHTML =
      '<div class="console-table"><table><thead><tr><th>(index)</th><th>id</th><th>name</th><th>role</th></tr></thead><tbody>';
    users.forEach((user, index) => {
      tableHTML += `<tr><td>${index}</td><td>${user.id}</td><td>${user.name}</td><td>${user.role}</td></tr>`;
    });
    tableHTML += '</tbody></table></div>';
    outputEl.innerHTML += tableHTML;
  };
  methods.dir.run = (outputEl) => {
    const myObject = {
      config: { theme: 'dark', version: '1.2' },
      data: [1, 2],
    };
    outputEl.innerHTML += `<p class=\"console-log\">> console.dir(myObject)</p>`;
    outputEl.innerHTML += `<pre class=\"console-log\">${JSON.stringify(
      myObject,
      null,
      2
    )}</pre>`;
  };
  methods.count.run = (outputEl) => {
    outputEl.innerHTML += `<p class=\"console-log\">> console.count(\"render\")</p>`;
    const count = (outputEl.dataset.renderCount || 0) * 1 + 1;
    outputEl.dataset.renderCount = count;
    outputEl.innerHTML += `<p class=\"console-log\">render: ${count}</p>`;
  };
  methods.time.run = (outputEl) => {
    const duration = (Math.random() * 50 + 20).toFixed(2);
    outputEl.innerHTML += `<p class=\"console-log\">> console.time(\"Task A\")</p>`;
    outputEl.innerHTML += `<p class=\"console-log\">> // ...some task... </p>`;
    outputEl.innerHTML += `<p class=\"console-log\">> console.timeEnd(\"Task A\")</p>`;
    outputEl.innerHTML += `<p class=\"console-log\">Task A: ${duration}ms</p>`;
  };
  methods.trace.run = (outputEl) => {
    outputEl.innerHTML += `<p class=\"console-log\">> console.trace(\"Trace from here\")</p>`;
    outputEl.innerHTML += `<pre class=\"console-log\">Trace: Trace from here\n    at run (index.html:300)\n    at HTMLButtonElement.onclick (index.html:250)</pre>`;
  };
  methods.group.run = (outputEl) => {
    outputEl.innerHTML += `<p class=\"console-log\">> console.group(\"User Details\")</p>`;
    outputEl.innerHTML += `<p class=\"console-log pl-4\">> console.log(\"Name: John\")</p>`;
    outputEl.innerHTML += `<p class=\"console-log pl-4\">Name: John</p>`;
    outputEl.innerHTML += `<p class=\"console-log pl-4\">> console.log(\"Email: john@dev.com\")</p>`;
    outputEl.innerHTML += `<p class=\"console-log pl-4\">Email: john@dev.com</p>`;
    outputEl.innerHTML += `<p class=\"console-log\">> console.groupEnd()</p>`;
  };
  methods.assert.run = (outputEl) => {
    outputEl.innerHTML += `<p class=\"console-log\">> const x = 5;</p>`;
    outputEl.innerHTML += `<p class=\"console-log\">> console.assert(x < 3, \"Assertion failed: x is not less than 3\")</p>`;
    outputEl.innerHTML += `<p class=\"console-error\">Assertion failed: Assertion failed: x is not less than 3</p>`;
  };

  return methods;
}

// Playground UI logic (to be imported in main script)
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
    delete outputEl.dataset.renderCount;
  });

  updateDetails(Object.keys(methods)[0]);
}
