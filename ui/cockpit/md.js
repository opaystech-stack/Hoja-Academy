/** Rendu Markdown minimal, sur — échappement HTML AVANT transformation.
 *  Supporte : titres #..####, paragraphes, listes - et 1., gras/italique, code inline,
 *  blocs ```code```, liens [txt](url), tableaux | .. |, citations >, hr ---,
 *  et les commandes LaTeX simples du contenu pédagogique ($\rightarrow$…). */
window.mdRender = function (src) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  /* Le contenu pédagogique écrit ses flèches en LaTeX (`$\rightarrow$`). Sans
     traitement, elles s'affichaient LITTÉRALEMENT dans le cours. On mappe les
     commandes connues vers le glyphe Unicode, et à défaut on retire les
     dollars et l'antislash pour ne jamais laisser de balise brute à l'écran. */
  const LATEX = {
    rightarrow: '→', to: '→', longrightarrow: '⟶', leftarrow: '←', leftrightarrow: '↔',
    Rightarrow: '⇒', Leftarrow: '⇐', times: '×', cdot: '·', approx: '≈', neq: '≠',
    ge: '≥', geq: '≥', le: '≤', leq: '≤', infty: '∞', pm: '±', deg: '°',
  };
  const tex = s => String(s)
    .replace(/\$\\?([A-Za-z]+)\$/g, (m, name) => (LATEX[name] != null ? LATEX[name] : name))
    /* Repli : `$x$` (variable mathématique). On exige que le corps commence par
       une lettre pour ne JAMAIS confondre avec un montant (« $250 000 »). */
    .replace(/\$([A-Za-z][^$\n]{0,30})\$/g, (m, body) => '<i>' + body + '</i>');
  // Emojis pedagogiques retires a l'AFFICHAGE uniquement (source Markdown intacte).
  // Applique a TOUT le texte inline, pas seulement aux titres : la charte Hoja
  // interdit l'emoji dans l'interface, y compris dans une puce de liste.
  const noEmoji = s => String(s).replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/\s{2,}/g, ' ').trim();
  const inline = s => tex(esc(noEmoji(s)))
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<i>$2</i>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const lines = String(src || '').replace(/\r\n/g, '\n').split('\n');
  let html = '', i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) { const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) { buf.push(esc(lines[i])); i++; } i++; html += '<pre>' + buf.join('\n') + '</pre>'; continue; }
    let h = l.match(/^(#{1,4})\s+(.*)/);
    if (h) { const lvl = Math.min(h[1].length + 2, 6); html += '<h' + lvl + '>' + inline(h[2]) + '</h' + lvl + '>'; i++; continue; }
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
