const fs = require('fs');
const { getAverageColor } = require('fast-average-color-node');

const folder = process.argv[2];
if (!folder) {
  console.error(`You need to pass a folder as an argument!`);
}

fs.readdir(folder, async (err, files) => {
  if (err) {
    console.error(`Could not read from folder ${folder}`, err);
    return;
  }

  const pairs = await Promise.all(files.map(async (file) => {
    if (file.split('.').pop() !== 'png') {
      return;
    }

    const color = await getAverageColor(`${folder}/${file}`, { mode: 'precision' });
    const blockId = file.substr(0, file.lastIndexOf('.'));
    
    return [blockId, color];
  }));

  const map = {};
  pairs.forEach((tuple) => {
    if (!tuple) return; // needed as we return undefined if the file extension isn't png (due to my laziness)
    map[tuple[0]] = tuple[1];
  });

  fs.writeFileSync('out.json', JSON.stringify(map));
});

