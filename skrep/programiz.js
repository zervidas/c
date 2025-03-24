const WebSocket = require('ws');
const chalk = require('chalk');
const axios = require('axios');

function generateUUID() {
  let t = Date.now();
  let o = performance && performance.now && Math.floor(1000 * performance.now()) || 0;
  
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    let r = 16 * Math.random();
    r = t > 0 ? (t + r) % 16 | 0 : (o + r) % 16 | 0;
    t = Math.floor(t / 16);
    o = Math.floor(o / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function generateOrganicUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function Execute(code, language = 'c', onOutput = (output) => {}, force = true) {
  return new Promise(async (resolve, reject) => {
    function generateSessionId() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({length: 10}, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }
    
    const response = force ? {} : await axios.post(
      'https://compiler-api.programiz.com/api/v1/code',
      {
        user_id: generateOrganicUUID(),
        session_id: generateUUID(),
        code: code,
        user_agent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
        language: language
      },
      {
        headers: {
          'accept': '*/*',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'content-type': 'application/json',
          'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
          'sec-ch-ua-mobile': '?1',
          'sec-ch-ua-platform': '"Android"',
          'referer': 'https://www.programiz.com/',
        }
      }
    );
    console.log(response.data || '')

    const sessionId = generateSessionId();
    const wsUrl = `wss://${language}.repl-web.programiz.com/socket.io/?sessionId=${sessionId}&lang=${language}&EIO=3&transport=websocket`;
    const ws = new WebSocket(wsUrl);
    let allLogs = '';
    let sid = '';

    ws.on('open', () => {
      console.log(chalk.gray('Connected to WebSocket server'));
    });

    ws.on('message', (data) => {
      const message = data.toString();
      
      if (message.startsWith('40')) {
        try {
          const { sid } = JSON.parse(message.substring(1));
          ws.send(`42["run",${JSON.stringify({ code })}]`);
        } catch (e) {
          reject(chalk.red(`Handshake error: ${e.message}`));
        }
        return;
      }

      if (message.startsWith('42["output"')) {
        try {
          const [ , payload ] = JSON.parse(message.substring(2));
          if (payload?.output) {
            const cleanOutput = payload.output.replace(/\\n/g, '\n').trim();
            allLogs += cleanOutput + '\n';
            onOutput(cleanOutput);
          }
        } catch (e) {
          console.error(chalk.red('Output parsing error:'), e);
        }
        return;
      }

      if (message === '41') {
        resolve(allLogs.trim());
      }
    });

    ws.on('close', () => resolve(allLogs.trim()));
    ws.on('error', (err) => reject(chalk.red(`Connection error: ${err.message}`)));
  });
}


// Contoh penggunaan untuk berbagai bahasa
const lang = [
  'c',
  'r',
  'cpp',
  'csharp',
  'python',
  'javascript',
  'golang',
  'php',
  'swift',
  'rust'
];

(async () => {
  try {
    // Contoh Go
    const goCode = `
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`;
    const goLogs = await Execute(goCode, 'golang', (output) => {
      console.log(chalk.blue('> Go output:'), output);
    });
    console.log(chalk.green('\nGo execution complete:\n'), goLogs);

    // Contoh PHP
    const phpCode = `<?php
echo "Hello, World!\\n";
?>`;
    const phpLogs = await Execute(phpCode, 'php', (output) => {
      console.log(chalk.blue('> PHP output:'), output);
    });
    console.log(chalk.green('\nPHP execution complete:\n'), phpLogs);

    // Contoh Swift
    const swiftCode = `
import Swift

print("Hello, World!")
`;
    const swiftLogs = await Execute(swiftCode, 'swift', (output) => {
      console.log(chalk.blue('> Swift output:'), output);
    });
    console.log(chalk.green('\nSwift execution complete:\n'), swiftLogs);

    // Contoh Rust
    const rustCode = `
fn main() {
    println!("Hello, World!");
}
`;
    const rustLogs = await Execute(rustCode, 'rust', (output) => {
      console.log(chalk.blue('> Rust output:'), output);
    });
    console.log(chalk.green('\nRust execution complete:\n'), rustLogs);

  } catch (err) {
    console.error(chalk.red('Error:'), err);
  }
})();
