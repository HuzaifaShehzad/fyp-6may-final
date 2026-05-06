/**
 * Lightweight markdown parser for chat messages.
 * Converts markdown to HTML for rendering in chat bubbles.
 * Supports: bold, italic, headers, lists, tables, blockquotes, code, links.
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseMarkdown(text) {
  if (!text) return '';

  // Split into lines for block-level processing
  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let inList = false;
  let listType = ''; // 'ul' or 'ol'
  let tableRows = [];

  function flushTable() {
    if (tableRows.length < 2) {
      // Not enough rows for a table
      tableRows.forEach(row => {
        html += `<p>${processInline(row)}</p>`;
      });
      tableRows = [];
      inTable = false;
      return;
    }

    html += '<div class="md-table-wrapper"><table class="md-table">';

    // First row is header
    const headerCells = tableRows[0].split('|').filter(c => c.trim());
    html += '<thead><tr>';
    headerCells.forEach(cell => {
      html += `<th>${processInline(cell.trim())}</th>`;
    });
    html += '</tr></thead>';

    // Skip separator row (index 1), process data rows
    html += '<tbody>';
    for (let r = 2; r < tableRows.length; r++) {
      const cells = tableRows[r].split('|').filter(c => c.trim());
      html += '<tr>';
      cells.forEach(cell => {
        html += `<td>${processInline(cell.trim())}</td>`;
      });
      html += '</tr>';
    }
    html += '</tbody></table></div>';

    tableRows = [];
    inTable = false;
  }

  function flushList() {
    if (inList) {
      html += listType === 'ol' ? '</ol>' : '</ul>';
      inList = false;
      listType = '';
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      if (inTable) flushTable();
      if (inList) flushList();
      continue;
    }

    // Table row (contains pipes)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (inList) flushList();
      // Check if it's a separator row
      const isSeparator = /^\|[\s\-:|]+\|$/.test(trimmed);
      if (!inTable && !isSeparator) {
        inTable = true;
      }
      tableRows.push(trimmed);
      // Check if next line is not a table row
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      if (!nextLine.startsWith('|') || !nextLine.endsWith('|')) {
        flushTable();
      }
      continue;
    }

    if (inTable) flushTable();

    // Headers
    if (trimmed.startsWith('###')) {
      if (inList) flushList();
      html += `<h5 class="md-h3">${processInline(trimmed.slice(3).trim())}</h5>`;
      continue;
    }
    if (trimmed.startsWith('##')) {
      if (inList) flushList();
      html += `<h4 class="md-h2">${processInline(trimmed.slice(2).trim())}</h4>`;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      if (inList) flushList();
      html += `<h3 class="md-h1">${processInline(trimmed.slice(2).trim())}</h3>`;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      if (inList) flushList();
      html += `<blockquote class="md-blockquote">${processInline(trimmed.slice(1).trim())}</blockquote>`;
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        if (inList) flushList();
        html += '<ol class="md-list">';
        inList = true;
        listType = 'ol';
      }
      html += `<li>${processInline(olMatch[2])}</li>`;
      continue;
    }

    // Unordered list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) flushList();
        html += '<ul class="md-list">';
        inList = true;
        listType = 'ul';
      }
      html += `<li>${processInline(trimmed.slice(2))}</li>`;
      continue;
    }

    // Sub-list items (indented)
    if ((trimmed.startsWith('  -') || trimmed.startsWith('   -')) && inList) {
      html += `<li class="md-sub-item">${processInline(trimmed.replace(/^\s*-\s*/, ''))}</li>`;
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      if (inList) flushList();
      html += '<hr class="md-hr" />';
      continue;
    }

    // Regular paragraph
    if (inList) flushList();
    html += `<p>${processInline(trimmed)}</p>`;
  }

  if (inTable) flushTable();
  if (inList) flushList();

  return html;
}

/**
 * Process inline markdown elements (bold, italic, code, links, emoji).
 */
function processInline(text) {
  if (!text) return '';

  // Escape HTML first
  let result = escapeHtml(text);

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code class="md-code">$1</code>');

  // Bold + Italic
  result = result.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');

  // Bold
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Italic
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Strikethrough
  result = result.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // Warning indicators
  result = result.replace(/⚠️/g, '<span class="md-warning">⚠️</span>');

  // Checkmarks
  result = result.replace(/✅/g, '<span class="md-check">✅</span>');

  return result;
}
