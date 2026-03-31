const fs = require('fs');
const path = require('path');
const https = require('https');
const Ajv = require('ajv');
const { execSync } = require('child_process');

const ajv = new Ajv({ strict: false });

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
const currentVersion = packageJson.version;

if (!/^\d+\.\d+\.\d+$/.test(currentVersion)) {
    console.error('Error: Version must be in the format x.x.x');
    process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(path.join(__dirname, 'info-json-schema.json'), 'utf8'));
const validate = ajv.compile(schema);

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        console.log(`Fetching ${url}...`);
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                return;
            }
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(new Error('Invalid JSON response: ' + error.message));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timed out'));
        });
    });
}

function formatDate(date) {
    return date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' GMT');
}

function showDiff(originalInfo, outputPath) {
    const tempPath = outputPath + '.old';
    fs.writeFileSync(tempPath, JSON.stringify(originalInfo, null, 2));
    try {
        const diff = execSync(`git diff --no-index "${tempPath}" "${outputPath}"`).toString();
        if (diff) {
            console.log('\nChanges made to info.json:');
            console.log(diff);
        } else {
            console.log('\nWarning: No changes detected in info.json');
            console.log('Did you remember to bump the plugin version in package.json?');
        }
    } catch (error) {
        if (error.stdout) {
            console.log('\nChanges made to info.json:');
            console.log(error.stdout.toString());
        }
    } finally {
        fs.unlinkSync(tempPath);
    }
}

async function createInfoJson() {
    try {
        console.log('Current version:', currentVersion);

        const info = await fetchJson('https://wpe-plugin-updates.wpengine.com/genesis-custom-blocks/info.json');
        const originalInfo = JSON.parse(JSON.stringify(info));
        console.log('Successfully fetched current info.json');

        info.version = currentVersion;
        info.download_link = info.download_link.replace(
            /genesis-custom-blocks\.\d+\.\d+\.\d+\.zip/,
            `genesis-custom-blocks.${currentVersion}.zip`
        );
        info.versions[currentVersion] = info.download_link;
        info.last_updated = formatDate(new Date());

        const buildDir = process.env.CI ? '/tmp/artifacts/wpe' : path.join(__dirname, '..', 'artifacts', 'wpe');
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }

        const outputPath = path.join(buildDir, 'info.json');
        fs.writeFileSync(outputPath, JSON.stringify(info, null, 2));

        const writtenInfo = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
        const isValid = validate(writtenInfo);
        if (!isValid) {
            console.error('Validation failed:');
            validate.errors.forEach((error) => {
                console.error(`- ${error.instancePath}: ${error.message}`);
            });
            process.exit(1);
        }

        console.log('Successfully created info.json at', outputPath);
        console.log('New info.json passed validation');
        showDiff(originalInfo, outputPath);
    } catch (error) {
        console.error('Error creating info.json:', error.message);
        process.exit(1);
    }
}

createInfoJson();
