const fs = require('fs');
const path = require('path');

const d = path.join(__dirname, 'src');
const r = (f) => fs.readFileSync(path.join(d, f), 'utf-8');

const js = (r('p2.js') + '\n' + r('p3.js') + '\n' + r('p4.js') + '\n' + r('p5.js'))
  .split('__LOGO__').join(r('logo_t.b64'))
  .split('__MARK__').join(r('mark_t.b64'));

const seedPath = path.join(d, 'seed.json');
let seedContent = 'null';
if (process.env.XTECH_EMBED_SEED === '1' && fs.existsSync(seedPath)) { // private data is NOT embedded unless you ask for it
  seedContent = r('seed.json').replace(/<\//g, '<\\/');
}

const fullHtml = r('p1.html') + '\n<script>window.XTECH_SEED = ' + seedContent + ';</script>\n<script>\n' + js + '\n</script>\n';
fs.writeFileSync(path.join(__dirname, 'xtech-hq.html'), fullHtml, 'utf-8');
fs.writeFileSync(path.join(__dirname, 'index.html'), fullHtml, 'utf-8'); // so http://localhost:3000/ opens the dashboard directly
console.log('Successfully built xtech-hq.html (' + fullHtml.length + ' bytes)');
