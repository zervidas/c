const axios = require('axios');

async function protectCode(code, config = {}) {
  const payload = {
    code: code,
    config: {
      booleanLiterals: { randomize: true },
      integerLiterals: { radix: "hexadecimal", randomize: true, lower: 2, upper: 500 },
      debuggerRemoval: true,
      stringLiterals: true,
      propertyIndirection: true,
      localDeclarations: { nameMangling: "glagolitic" },
      controlFlow: { randomize: true },
      constantArgument: true,
      domainLock: false,
      functionReorder: { randomize: true },
      propertySparsing: true,
      variableGrouping: true,
      ...config
    }
  };

  try {
    const response = await axios.post('http://api.fusions.my.id/api/v1/protect', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Protection failed: ${error.response.data.error || error.message}`);
    } else if (error.request) {
      throw new Error('No response received from the protection service');
    } else {
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
}

async function main() {
  const code = `
    console.log(\`The answer is: \${theAnswer(true)}\`);
    function theAnswer(theReal) {
      let answer = 0;
      for (let i = theReal ? 1 : 2 ; i <= 9; i++ ) {
        if (i >= 3) {
          answer += i;
          debugger;
        }
      }
      return answer;
    }
  `;

  const customConfig = {
    integerLiterals: { radix: "decimal", randomize: false },
    controlFlow: { randomize: false }
  };

  try {
    const result = await protectCode(code, customConfig);
    console.log("Protected code:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main().catch(err => console.error('Runtime error:', err));
