发布检查相关知识
1、持续集成 | Git Hooks基本用法
终端上进行的
mkdir git-demo -> ls ->touch README.md ->git init ->ls -> git add README.md -> git commit -a -m "init" -> git status -> git log  -ls -l -> ls -a -> open  ./.git -> which node -> cd .git -> cd hooks/ -> ls -l ./pre-commit -> chmod +x ./pre-commit ->ls -l ./pre-commit - ./pre-commit
需要改变一下./pre-commit的权限 chmod +x ./pre-commit

2、 ESlink  https://eslint.org/docs/developer-guide/nodejs-api
安装eslint 因为是工具，所以用save-dev
npm install --save-dev eslint -> (配置eslint)npx  eslint --init ->  eslint ./index.js ->

<!-- https://eslint.org/docs/developer-guide/nodejs-api -->
3.Headless Chrome 
chrome 二进制文件应该指向你安装 Chrome 的位置。确切的位置会因平台差异而不同。当前我在 Mac 上操作，所以我为安装的每个版本的 Chrome 都创建了方便使用的别名。

如果您使用 Chrome 的稳定版，并且无法获得测试版，我建议您使用 chrome-canary 版本
```ruby
alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"
alias chrome-canary="/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary"
alias chromium="/Applications/Chromium.app/Contents/MacOS/Chromium"
```
3.2 打印 DOM
--dump-dom 标志将打印 document.body.innerHTML 到标准输出：
```ruby
chrome --headless --disable-gpu --dump-dom about:blank
```

3.3 打印到txt文件中
```ruby
chrome --headless --disable-gpu --dump-dom about:blank > tmp.txt
```

3.4 puppeteteer https://github.com/puppeteer/puppeteer/blob/main/docs/api.md
安装puppeteteer
```ruby
sudo  npm install --save-dev puppeteer
```
ElementHandle  https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-elementhandle
ElementHandle represents an in-page DOM element. ElementHandles can be created with the page.$ method.
```ruby
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  const hrefElement = await page.$('a');
  await hrefElement.click();
  // ...
})();
```