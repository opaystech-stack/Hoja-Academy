/** Rendu Markdown minimal, sur — échappement HTML AVANT transformation.
 *  Supporte : titres #..####, paragraphes, listes - et 1., gras/italique, code inline,
 *  blocs ```code```, liens [txt](url), tableaux | .. |, citations >, hr ---. */
window.mdRender = function (src) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const lines = String(src || '').replace(/\r\n/g, '\n').split('\n');
  // Emojis pedagogiques retires a l'AFFICHAGE uniquement (source Markdown intacte)
  const noEmoji = s => String(s).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/\s{2,}/g, ' ').trim();
  let html = '', i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) { buf.push(esc(lines[i])); i++; } i++; html += '<pre>' + buf.join('\n') + '</pre>'; continue; }
    let h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { const lvl = Math.min(h[1].length + 2, 6); html += '<h' + lvl + '>' + inline(noEmoji(h[2])) + '</h' + lvl + '>'; i++; continue; }
    if (/^(-{3,}|\*{3,})\s*$/.test(l)) { html += '<hr>'; i++; continue; }
    if (/^>\s?/.test(l)) { const buf = []; while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(inline(lines[i].replace(/^>\s?/, ''))); i++; } html += '<blockquote>' + buf.join('<br>') + '</blockquote>'; continue; }
    if (/^\s*\|/.test(l)) {
      const rows = []; while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = r => r.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => inline(c.trim()));
      let t = '<table><thead><tr>' + cells(rows[0]).map(c => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
      for (let k = 1; k < rows.length; k++) { if (/^\s*\|[\s:|-]+\|?\s*$/.test(rows[k])) continue; t += '<tr>' + cells(rows[k]).map(c => '<td>' + c + '</td>').join('') + '</tr>'; }
      html += t + '</tbody></table>'; continue;
    }
    if (/^\s*[-•*]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*[-•*]\s+/.test(lines[i])) { buf.push('<li>' + inline(lines[i].replace(/^\s*[-•*]\s+/, '')) + '</li>'); i++; } html += '<ul>' + buf.join('') + '</ul>'; continue; }
    if (/^\s*\d+[.)]\s+/.test(l)) { const buf = []; while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { buf.push('<li>' + inline(lines[i].replace(/^\s*\d+[.)]\s+/, '')) + '</li>'); i++; } html += '<ol>' + buf.join('') + '</ol>'; continue; }
    if (/^\s*$/.test(l)) { i++; continue; }
    const buf = []; while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#|```|\s*[-•]\s|\s*\d+[.)]\s|>|\|)/.test(lines[i])) { buf.push(inline(lines[i])); i++; }
    html += '<p>' + buf.join('<br>') + '</p>';
  }
  return html;
};
