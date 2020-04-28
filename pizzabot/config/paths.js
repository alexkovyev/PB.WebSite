'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

if (!process.env.PROJECT_NAME) {
  process.env.PROJECT_NAME = 'admin';
}

const envEntryPoint = process.env.PROJECT_NAME;

console.log('Building project ' + envEntryPoint);

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

//Admin anon 
const resolveDist = () => {
  switch (envEntryPoint) {
	  case 'admin':
    case 'anon': return resolveApp('../dist/anon');
		default:
		  return resolveApp('../dist/admin');
	}
};

const resolveHTML = () => {
    switch (envEntryPoint) {
		case 'admin':
    case 'anon': return resolveApp('public/anon/index.html')
		default:
			return resolveApp('public/admin/index.html');
	}
};

const resolveIndex = () => {
    switch (envEntryPoint) {
		case 'admin':
    case 'anon': return resolveModule(resolveApp, 'src/anon/index');
		default:
			return resolveModule(resolveApp, 'src/admin/index');
	}
};

const resolvePublic = () => {
    switch (envEntryPoint) {
		case 'admin':
    case 'anon': resolveApp('public/anon');
		default:
			return resolveApp('public/admin');
	}
};

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveDist(),
  appBuildDev: resolveDist(),
  appPublic: resolvePublic(),
  appHtml: resolveHTML(),
  appIndexJs: resolveIndex(),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('config/jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
