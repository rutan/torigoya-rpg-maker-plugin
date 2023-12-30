const titleRegexp = /^#(?!#)\s*(.+)$/;
const bookTitleRegexp = /^##(?!#)\s*(?:if\((.+)\):)?\s*(.+)$/;
const pageBorderRegexp = /^(?:-{3,}|_{3,})$/;

export class TextParser {
  parse(text) {
    const lines = text.split(/\r?\n/);
    return {
      title: this.parseBookshelfTitle(lines),
      books: this.parseBooks(lines),
    };
  }

  parseBookshelfTitle(lines) {
    const titleLine = lines.find((line) => line.match(titleRegexp));
    if (!titleLine) return '';
    return titleLine.match(titleRegexp)[1];
  }

  parseBooks(lines) {
    const books = [];
    lines = lines.slice(0);

    while (lines.length) {
      const line = lines.shift();

      const title = line.match(bookTitleRegexp);
      if (!title) continue;

      const contentLines = [];
      while (lines[0] !== undefined && !lines[0].match(bookTitleRegexp)) {
        contentLines.push(lines.shift());
      }

      books.push({
        title: title[2],
        condition: title[1],
        pages: this.parseBookContent(contentLines),
      });
    }

    return books;
  }

  parseBookContent(lines) {
    lines = lines.slice(0);
    const pages = [];

    while (lines.length) {
      const pageLines = [];
      while (lines[0] !== undefined && !lines[0].match(pageBorderRegexp)) {
        pageLines.push(lines.shift());
      }
      pages.push(this.parsePage(pageLines));
      lines.shift();
    }

    return pages;
  }

  parsePage(lines) {
    return lines.join('\n').trim();
  }
}
