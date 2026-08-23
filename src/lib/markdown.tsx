import { Fragment, type ReactNode } from 'react';

type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; value: string; href: string };

function parseInline(input: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let buffer = '';
  let i = 0;

  const flush = () => {
    if (buffer) {
      tokens.push({ type: 'text', value: buffer });
      buffer = '';
    }
  };

  while (i < input.length) {
    const rest = input.slice(i);

    const linkMatch = rest.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      flush();
      tokens.push({ type: 'link', value: linkMatch[1], href: linkMatch[2] });
      i += linkMatch[0].length;
      continue;
    }

    const codeMatch = rest.match(/^`([^`]+)`/);
    if (codeMatch) {
      flush();
      tokens.push({ type: 'code', value: codeMatch[1] });
      i += codeMatch[0].length;
      continue;
    }

    const boldMatch = rest.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      flush();
      tokens.push({ type: 'bold', value: boldMatch[1] });
      i += boldMatch[0].length;
      continue;
    }

    const italicMatch = rest.match(/^_([^_]+)_/);
    if (italicMatch) {
      flush();
      tokens.push({ type: 'italic', value: italicMatch[1] });
      i += italicMatch[0].length;
      continue;
    }

    buffer += input[i];
    i += 1;
  }

  flush();
  return tokens;
}

function renderInline(value: string): ReactNode {
  return parseInline(value).map((token, idx) => {
    switch (token.type) {
      case 'bold':
        return <strong key={idx}>{renderInline(token.value)}</strong>;
      case 'italic':
        return <em key={idx}>{renderInline(token.value)}</em>;
      case 'code':
        return <code key={idx}>{token.value}</code>;
      case 'link':
        return (
          <a key={idx} href={token.href} target="_blank" rel="noopener noreferrer">
            {token.value}
          </a>
        );
      case 'text':
        return <Fragment key={idx}>{token.value}</Fragment>;
    }
  });
}

interface Block {
  type: 'heading' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'hr';
  level?: number;
  items?: string[];
  content?: string;
  ordered?: boolean;
}

function splitLines(input: string): string[] {
  return input.split(/\r?\n/);
}

function parseBlocks(markdown: string): Block[] {
  const lines = splitLines(markdown.trim());
  const blocks: Block[] = [];
  let i = 0;

  const pushParagraph = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    blocks.push({ type: 'paragraph', content: trimmed });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '---') {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    if (/^\s*```/.test(line)) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      blocks.push({ type: 'code', content: codeLines.join('\n') });
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, content: headingMatch[2] });
      i += 1;
      continue;
    }

    const quoteMatch = line.match(/^>\s?(.*)/);
    if (quoteMatch) {
      const quoteLines: string[] = [];
      while (i < lines.length) {
        const q = lines[i].match(/^>\s?(.*)/);
        if (!q) break;
        quoteLines.push(q[1]);
        i += 1;
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join(' ') });
      continue;
    }

    if (/^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length) {
        const match = lines[i].match(ordered ? /^\d+\.\s+(.*)/ : /^[-*+]\s+(.*)/);
        if (!match) break;
        items.push(match[1]);
        i += 1;
      }
      blocks.push({ type: 'list', items, ordered });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const paragraphLines: string[] = [line];
    i += 1;
    while (i < lines.length && lines[i].trim()) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    pushParagraph(paragraphLines.join(' '));
  }

  return blocks;
}

export function renderMarkdown(markdown: string): ReactNode {
  const blocks = parseBlocks(markdown);
  return blocks.map((block, idx) => {
    switch (block.type) {
      case 'heading': {
        const Tag = `h${Math.min(block.level ?? 2, 6)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        return <Tag key={idx}>{renderInline(block.content ?? '')}</Tag>;
      }
      case 'paragraph':
        return <p key={idx}>{renderInline(block.content ?? '')}</p>;
      case 'blockquote':
        return <blockquote key={idx}>{renderInline(block.content ?? '')}</blockquote>;
      case 'code':
        return <pre key={idx}><code>{block.content}</code></pre>;
      case 'hr':
        return <hr key={idx} />;
      case 'list':
        if (block.ordered) {
          return (
            <ol key={idx}>
              {block.items?.map((item, itemIdx) => (
                <li key={itemIdx}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }
        return (
          <ul key={idx}>
            {block.items?.map((item, itemIdx) => (
              <li key={itemIdx}>{renderInline(item)}</li>
            ))}
          </ul>
        );
    }
  });
}
