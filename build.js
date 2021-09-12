const fs = require('fs');
const archiver = require('archiver');
const ClosureCompiler = require('google-closure-compiler').compiler;
const buildShaders = require('./shadermin.js').buildShaders;
const roadroller = require('roadroller');
const devMode = process.argv.includes('--dev');

/**
 * Compiles
 * @return {Promise} promise
 */
function compile() {
  return new Promise((resolve, reject) => {
    const closureCompiler = new ClosureCompiler({
      language_in: 'ECMASCRIPT_NEXT',
      language_out: 'ECMASCRIPT_2020',
      compilation_level: devMode ? 'SIMPLE' : 'ADVANCED',
      strict_mode_input: true,
      warning_level: 'VERBOSE',
      summary_detail_level: 3,
      externs: 'src/externs.js',
      jscomp_error: '*',
      jscomp_off: [
        'missingRequire',
      ],
      js: [
        'src/lib/debug.js',
        'src/lib/codegolf.js',
        'src/lib/os13k.js',
        'src/lib/rng.js',
        'src/lib/vec3.js',
        'src/lib/mat4.js',
        'src/lib/geometry.js',
        'src/lib/bufferset.js',
        'src/lib/events.js',
        'src/lib/keyboard.js',
        'src/lib/glconstants.js',
        'src/lib/overlay.js',
        'src/lib/fbo.js',
        'src/lib/camera.js',
        'src/lib/shaders.js',
        'src/lib/engine.js',
        'src/lib/lib.js',
        'src/entities/entity.js',
        'src/entities/alien.js',
        'src/entities/coin.js',
        'src/entities/flagpole.js',
        'src/entities/fuel.js',
        'src/entities/hero.js',
        'src/entities/kang.js',
        'src/entities/mystery.js',
        'src/entities/particle.js',
        'src/entities/platform.js',
        'src/entities/shooter.js',
        'src/entities/spaceship.js',
        'src/zzfx.js',
        'src/zzfxm.js',
        'src/sound.js',
        'src/music.js',
        'src/constants.js',
        'src/colors.js',
        'src/hud.js',
        'src/menu.js',
        'src/mapgen.js',
        'src/index.js',
      ],
      js_output_file: 'dist/index.js',
    });

    closureCompiler.run((exitCode, stdOut, stdErr) => {
      if (stdOut) {
        console.log(stdOut.trim());
      }
      if (exitCode === 0) {
        resolve();
      } else {
        reject(stdErr.trim());
      }
    });
  });
}

/**
 * Updates the JS file in place using property shortcuts.
 * @return {Promise}
 */
function compressStandardProperties() {
  return new Promise((resolve, reject) => {
    let js = fs.readFileSync('./dist/index.js', {encoding: 'utf8', flag: 'r'});

    const buildShortcut = (name) => name.substr(0, 3) + name.substr(-3) + (name[name.length - 8] || '_');
    const tokens = [
      'bindTexture',
      'texParameteri',
      'enableVertexAttribArray',
      'bufferData',
      'bindVertexArray',
      'bindBuffer',
      'vertexAttribPointer',
      'uniformMatrix4fv',
      'activeTexture',
      // 'framebufferTexture2D',
      // 'getUniformLocation',
      // 'createVertexArray',
    ];

    for (const token of tokens) {
      js = js.replaceAll(token, buildShortcut(token));
    }

    fs.writeFileSync('./dist/index.js', js);
    resolve();
  });
}

/**
 * Creates the HTML file with embedded javascript.
 * @return {Promise}
 */
function createHtml() {
  return new Promise((resolve, reject) => {
    const html = fs.readFileSync('./src/index.html', {encoding: 'utf8', flag: 'r'});
    const js = fs.readFileSync('./dist/index.js', {encoding: 'utf8', flag: 'r'});

    if (devMode) {
      // Use fast and simple
      const out = html.replace(
          '<script src="index.js"></script>',
          '<script>\n' +
          js + '\n' +
          '</script>');
      fs.writeFileSync('./dist/index.html', out);
      resolve();
      return;
    }

    // Use roadroller
    const inputs = [{
      data: js,
      type: 'js',
      action: 'eval',
    }];
    const options = {};
    const packer = new roadroller.Packer(inputs, options);
    packer.optimize().then((result) => {
      const {firstLine, secondLine} = packer.makeDecoder();
      const out = html.replace(
          '<script src="index.js"></script>',
          '<script>\n' +
        firstLine + '\n' +
        secondLine + '\n' +
        '</script>');
      fs.writeFileSync('./dist/index.html', out);
      resolve();
    });
  });
}

/**
 * Creates a zip file of the submission.
 * @return {Promise}
 */
function createZip() {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', {zlib: {level: 9}});
    const output = fs.createWriteStream('dist/dist.zip');
    output.on('close', () => {
      const packageSize = archive.pointer();
      const percent = packageSize / 13312 * 100;
      console.log(`Package: ${packageSize} bytes (${percent.toFixed(2)}%)`);
      resolve(packageSize);
    });
    output.on('error', (error) => {
      packageSize = -1;
      reject(error);
    });
    archive.on('error', (error) => {
      packageSize = -1;
      reject(error);
    });
    archive.pipe(output);
    archive.file('dist/index.html', {name: 'index.html'});
    archive.finalize();
  });
}

/**
 * Performs a full build.
 */
function build() {
  buildShaders()
      .then(compile)
      .then(compressStandardProperties)
      .then(createHtml)
      .then(createZip)
      .catch((reason) => console.log(reason));
}

if (require.main === module) {
  build();
}
