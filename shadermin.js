const SHADERS_DIR = './src/lib/shaders/';
const VERSION_PREFIX = '#version 300 es';
const PRECISION_PREFIX = 'precision highp float;';
const EXTERN_ATTRIBUTES = ['uniform', 'in', 'out'];
const PRECISION_ATTRIBUTES = ['lowp', 'mediump', 'highp'];
const VARIABLE_TYPES = ['bool', 'float', 'vec2', 'vec3', 'vec4', 'mat4'];
const RENAME_ENABLED = true;
const ADD_NEWLINES = false;

const fs = require('fs');

/**
 * Returns true if the file is a GLSL shader file.
 * @param {string} file
 * @return {boolean}
 */
const isShaderFile = (file) =>
  file.endsWith('.vert') ||
  file.endsWith('.frag');

/**
 * Tokenizes a shader file contents.
 * @param {string} content
 * @return {Array.<string>}
 */
const tokenize = (content) => {
  // Capture groups:
  // 1) Alphanumeric
  // 2) Semicolons
  // 2) Other Punctuation (not alphanumeric, not whitespace)
  // 3) New lines
  const regex = /([\w]+)|(;)|([^\w\s;]+)|(\n)/g;
  const results = [];
  let next = null;
  while ((next = regex.exec(content))) {
    results.push(next[0]);
  }
  return results;
};

/**
 * GLSL Parser.
 */
class Parser {
  /**
   * Creates a new parser.
   * @param {!Array.<string>} tokens
   */
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  /**
   * Resets the current marker to the beginning.
   */
  reset() {
    this.index = 0;
  }

  /**
   * Returns true if the current marker is at/past the end of file.
   * @return {boolean}
   */
  eof() {
    return this.index >= this.tokens.length;
  }

  /**
   * Returns the a token at an offset from the current token.
   * @param {number} delta
   * @return {string}
   */
  peek(delta) {
    const index = this.index + delta;
    if (index < 0 || index >= this.tokens.length) {
      return 'EOF';
    }
    return this.tokens[index];
  }

  /**
   * Returns the current token.
   * @return {string}
   */
  curr() {
    return this.peek(0);
  }

  /**
   * Skips ahead until the target value is found.
   * @param {string} target
   */
  skipTo(target) {
    while (this.curr() !== target) {
      this.index++;
    }
  }

  /**
   * Deletes the current token.
   */
  deleteToken() {
    this.tokens.splice(this.index, 1);
  }

  /**
   * Deletes tokens from current to target (including the target token).
   * @param {string} target
   */
  deleteTo(target) {
    while (this.curr() !== target) {
      this.deleteToken();
    }
    this.deleteToken();
  }

  /**
   * Removes all comments from the parser tokens.
   */
  removeComments() {
    this.reset();
    while (!this.eof()) {
      const curr = this.curr();
      if (curr === '//' || curr === '#' || curr === 'precision') {
        this.deleteTo('\n');
      } else {
        this.index++;
      }
    }
  }

  /**
   * Removes all new lines from the parser tokens.
   */
  removeNewLines() {
    this.reset();
    while (!this.eof()) {
      if (this.curr() === '\n') {
        this.deleteToken();
      } else {
        this.index++;
      }
    }
  }
}

/**
 * Shader
 */
class Shader {
  /**
   * Creates a new shader parser
   * @param {string} fileName
   */
  constructor(fileName) {
    this.fileName = fileName;

    const content = fs.readFileSync(SHADERS_DIR + fileName, {encoding: 'utf8', flag: 'r'});
    const tokens = tokenize(content);
    const parser = new Parser(tokens);
    parser.removeComments();
    parser.removeNewLines();

    this.parser = parser;
    this.localVariables = {};
  }

  /**
   * Returns the const variable name for the JavaScript output file.
   * @return {string}
   */
  getConstName() {
    return this.fileName.replace('.', '_').toUpperCase();
  }
}

/**
 * Builds the shaders.js file from the original GLSL shaders.
 * @return {!Promise}
 */
exports.buildShaders = () => new Promise((resolve, reject) => {
  const fileNames = fs.readdirSync(SHADERS_DIR).filter(isShaderFile);
  const files = fileNames.map((fileName) => new Shader(fileName));

  // Gather a list of all declarations
  const globalVariables = {};
  files.forEach((file) => {
    const parser = file.parser;
    parser.reset();
    while (!parser.eof()) {
      const curr = parser.curr();
      if (EXTERN_ATTRIBUTES.includes(curr)) {
        if (PRECISION_ATTRIBUTES.includes(parser.peek(1))) {
          const type = parser.peek(1) + ' ' + parser.peek(2);
          const name = parser.peek(3);
          globalVariables[name] = {type: type, name: name};
          parser.index += 4;
        } else {
          const type = parser.peek(1);
          const name = parser.peek(2);
          globalVariables[name] = {type: type, name: name};
          parser.index += 3;
        }
      } else if (VARIABLE_TYPES.includes(curr)) {
        const type = curr;
        const name = parser.peek(1);
        if (name.match(/\w+/)) {
          file.localVariables[name] = {type: type, name: name, references: 0};
        }
        parser.index += 2;
      } else {
        parser.index++;
      }
    }
  });

  // Count uses of local variables
  files.forEach((file) => {
    const tokens = file.parser.tokens;
    for (let i = 0; i < tokens.length; i++) {
      const input = tokens[i];
      if (input.match(/\w+/)) {
        const variable = file.localVariables[input];
        if (variable) {
          variable.references++;
        }
      }
    }
  });

  // Inline variables
  files.forEach((file) => {
    Object.values(file.localVariables).forEach((variable) => {
      // If the variable is only used once
      // Then replace the one use with the body of the variable declaration.
      if (variable.references === 2) {
        const value = [];
        const parser = file.parser;
        parser.reset();
        while (!parser.eof()) {
          if (parser.curr() === variable.type && parser.peek(1) === variable.name) {
            // Found the declaration
            parser.deleteToken();
            parser.deleteToken();
            if (parser.curr() !== '=') {
              throw new Error('Expected "=" for variable declaration');
            }
            parser.deleteToken();
            while (parser.curr() !== ';') {
              value.push(parser.curr());
              parser.deleteToken();
            }
            if (parser.curr() !== ';') {
              throw new Error('Expected ";" to end variable declaration');
            }
            parser.deleteToken();
          } else if (parser.curr() === variable.name) {
            // Found the use
            if (value.length > 1) {
              value.unshift('(');
              value.push(')');
            }
            parser.tokens.splice(parser.index, 1, ...value);
          } else {
            parser.index++;
          }
        }
      }
    });
  });

  const output = [
    '// Autogenerated by shadermin.js\n',
    '// Do not modify manually\n',
    '\n',
  ];

  // Assign replacement names for all variables
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let nextVarIndex = 0;

  // Global variables first
  Object.values(globalVariables).sort((a, b) => a.name.localeCompare(b.name)).forEach((variable) => {
    if (RENAME_ENABLED) {
      variable.rename = alphabet.charAt(nextVarIndex++);
    } else {
      variable.rename = variable.name;
    }
    if (variable.name.startsWith('u_') || variable.name.startsWith('a_')) {
      const constName = variable.name.replace('u_', 'UNIFORM_').replace('a_', 'ATTRIBUTE_').toUpperCase();
      output.push(`const ${constName} = '${variable.rename}';\n`);
    }
  });

  const globalCount = nextVarIndex;

  // Local variables next
  files.forEach((file) => {
    nextVarIndex = globalCount;
    Object.values(file.localVariables).sort((a, b) => a.name.localeCompare(b.name)).forEach((variable) => {
      if (RENAME_ENABLED) {
        variable.rename = alphabet.charAt(nextVarIndex++);
      } else {
        variable.rename = variable.name;
      }
    });
  });

  // Now that variables have been renamed,
  // actually go through and replace all the names
  files.forEach((file) => {
    const tokens = file.parser.tokens;
    for (let i = 0; i < tokens.length; i++) {
      const input = tokens[i];
      const globalVariable = globalVariables[input];
      const localVariable = file.localVariables[input];
      if (globalVariable) {
        tokens[i] = globalVariable.rename;
      } else if (localVariable) {
        tokens[i] = localVariable.rename;
      }
    }
  });

  output.push('\n');
  output.push(`const GLSL_PREFIX =\n`);
  output.push(`  '${VERSION_PREFIX}\\n' +\n`);
  output.push(`  '${PRECISION_PREFIX}';\n`);

  // Then re-write the file with variable replacements and other optimizations
  files.forEach((file) => {
    output.push('\n');
    output.push(`const ${file.getConstName()} =\n`);
    output.push(`  GLSL_PREFIX +\n`);
    output.push(`  '`);

    const tokens = file.parser.tokens;
    let prev = '';
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];
      if (prev.match(/\w+/) && curr.match(/\w+/)) {
        output.push(' ');
      }

      output.push(curr);

      if (i !== tokens.length - 1 && (curr === ';' || curr.endsWith('{') || curr.endsWith('}'))) {
        if (ADD_NEWLINES) {
          output.push('\\n');
        }
        output.push(`' +\n  '`);
      }

      prev = curr;
    }

    output.push(`';\n`);
  });

  fs.writeFileSync('./src/lib/shaders.js', output.join(''));
  resolve();
});
