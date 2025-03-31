const fs = require('fs');
const childProcess = require('child_process');

let version = 'v1.0.0';

try {
    // 嘗試獲取當前 Git Tag 或最新提交資訊
    const gitOutput = childProcess.execSync('git describe --tags --always').toString().trim();

    // 如果是純提交哈希（無 Tag），嘗試獲取最新的 Tag
    if (/^[0-9a-f]{7,}$/.test(gitOutput)) { // 檢查是否為提交哈希
        try {
            const latestTag = childProcess.execSync('git describe --tags --abbrev=0').toString().trim();
            version = latestTag; // 使用最新的 Tag
        } catch (tagError) {
            console.warn('No tags found in repository, falling back to default version');
        // 若無 Tag，保持預設值 v1.0.0
        }
    } else {
        version = gitOutput; // 使用 git describe 的結果（已有 Tag）
    }
} catch (error) {
    console.warn('Git not available or repository error, using default version');
    // 若 Git 不可用，保持預設值 v1.0.0
}

// 寫入 src/version.ts
fs.writeFileSync('src/version.ts', `export const VERSION = '${version}';`);

console.log(`Generated version: ${version}`);