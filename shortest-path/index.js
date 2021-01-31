const inquirer = require('inquirer');

const randomGraph = require('../utils/randomGraph');

const floyd = require('./floyd');
const dijkstra = require('./dijkstra');

module.exports = function () {
  inquirer
    .prompt([{
      type: 'number',
      name: 'size',
      message: 'Please input the size of graph',
      default: '10',
      validate: value => {
        return value > 0 && value < 200;
      }
    }])
    .then(async answers => {
      const size = ~~answers.size;
      let edges = [];

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const answers = await inquirer.prompt([{
          type: 'input',
          message: 'Please input the weighted edges of the graph (empty for random)',
          name: 'numbers',
          default: '0,1,5',
          validate: input => {
            if (!input) return true;

            const regex = /\d+(\s+|,|;)\d+(\s+|,|;)\d+/;

            if (!regex.test(input)) return false;

            const [n1, n2] = input.split(/\s+|,|;/).map(r => ~~r.trim());

            if (n1 === n2) return false;

            if (n1 < 0 || n1 > size) return false;

            if (n2 < 0 || n2 > size) return false;

            if (edges.find(edge => edge[0] === n1 && edge[1] === n2)) return false;

            return true;
          }
        }]);

        if (!answers.numbers) break;

        const numbers = answers.numbers.split(/\s+|,|;/).map(r => ~~r.trim());
        edges.push(numbers);
      }

      if (!edges.length) edges = randomGraph('sp', size);

      console.log(`[ ${edges.map(edge => `[ ${edge.join(', ')} ]`).join(', ')} ]\n`);

      console.log(`FLOYD:\nSUM:${floyd(size, edges)}\n`);
      console.log(`DIJKSTRA:\nSUM:${dijkstra(size, edges)}\n`);
    });
};
