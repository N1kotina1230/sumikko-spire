# 发布《角落尖塔》到 GitHub Pages

游戏是纯静态 React + TypeScript + Vite 应用，朋友打开 HTTPS 链接即可游玩，无需下载、安装、登录 ChatGPT 或运行服务器。

## 当前仓库与发布地址

- 仓库：https://github.com/N1kotina1230/sumikko-spire
- 启用并成功部署后，预期地址：https://n1kotina1230.github.io/sumikko-spire/
- 这只是预期地址；以仓库 Settings → Pages 和 Actions 部署成功后显示的链接为准。
- 当前 GitHub 仓库为私有。免费个人账户的 Pages 需要公开仓库；公开后，源码和仓库文件也会被所有人看到。工作流不会自行修改可见性。
- 私有仓库中会执行构建检查，免费部署任务会显示 Skipped；公开并启用 Pages 后手动运行一次工作流即可。

## 第一次启用：在 GitHub 网页点击这些位置

1. 登录 GitHub，打开上面的仓库。
2. 点击仓库顶部 **Settings**（设置）。如果看不到，需由仓库所有者操作。
3. 如使用 GitHub Free：在 **General** 页面滚动到底部 **Danger Zone**，找到 **Change repository visibility** → **Change visibility** → **Make public**。确认愿意公开源码后，按页面提示输入仓库名称并确认。已有支持私有 Pages 的付费套餐时，可选择自己的部署方式；当前提供的工作流面向免费公开仓库。
4. 在 Settings 左侧 **Code and automation** 下点击 **Pages**。
5. 找到 **Build and deployment** → **Source**，选择 **GitHub Actions**。不需要选择 gh-pages 分支，也不需要创建另一份工作流。
6. 打开仓库顶部 **Actions**。如出现工作流启用提示，点击允许启用。若运行仍被禁止，检查 **Settings → Actions → General → Actions permissions** 是否允许本工作流使用的 GitHub 官方 actions。
7. 左侧选择 **Deploy Sumikko Spire to GitHub Pages**，点击右侧 **Run workflow**，Branch 选择 **main**，再点击绿色 **Run workflow**。
8. 打开这次运行，等待 **build**、**deploy** 都变绿。首次部署可能需要几分钟。
9. 返回 **Settings → Pages**，点击 **Visit site**。把页面提供的完整 HTTPS 地址发给朋友。

如果自动创建的 `github-pages` environment 要求审批，在工作流页面点击 **Review deployments** 并批准；不要因此再次创建工作流。

## 以后如何提交修改

首次在自己的电脑克隆仓库：

```bash
git clone https://github.com/N1kotina1230/sumikko-spire.git
cd sumikko-spire
npm ci
npm run dev
```

修改后执行：

```bash
npm test
npm run build
git add .
git commit -m "更新角落尖塔"
git push origin main
```

第一次 push 如要求登录，使用 GitHub Desktop、浏览器登录的 Git Credential Manager，或 `gh auth login`。不要把访问令牌写进代码或发给他人。

每次推送 main，Actions 都会自动测试、构建并发布。使用分支时，合并到 main 后才发布。也可以通过 GitHub 网页编辑文件，点击 Commit changes 并提交到 main。

不要提交 `node_modules/`、`dist/`、`work/`、`.env` 或登录凭证；已通过 `.gitignore` 排除。源码下载 ZIP 在每次开发启动和构建时自动生成，也不需要手动提交。

## GitHub Pages 路径如何配置

- 当前仓库是项目站点，页面根路径为 `/sumikko-spire/`。
- 工作流根据仓库名称自动设置 `VITE_BASE_PATH`；改名后也无需改代码。
- `vite.config.ts` 读取该变量，开发及其他根域名托管默认使用 `/`。
- JS、CSS 由 Vite 生成正确的前缀。角色图、网页图标与源码下载链接也统一使用同一个前缀。
- SVG 森林、敌人和卡牌插画直接包含在应用中；音效由 Web Audio API 在用户点击后生成，没有外部音频文件或跨站资源依赖。
- 应用没有需要服务器重写的页面路由，刷新游戏地址不会依赖 history fallback。

在 macOS/Linux 本地模拟项目子路径：

```bash
VITE_BASE_PATH=/sumikko-spire/ npm run build
VITE_BASE_PATH=/sumikko-spire/ npm run preview -- --host 127.0.0.1
```

PowerShell：

```powershell
$env:VITE_BASE_PATH="/sumikko-spire/"
npm run build
npm run preview -- --host 127.0.0.1
```

打开终端打印的地址后加上 `/sumikko-spire/`。例如 `http://127.0.0.1:4173/sumikko-spire/`。

如果以后绑定自定义域名，在仓库 **Settings → Secrets and variables → Actions → Variables** 新建 Repository variable `PAGES_BASE_PATH`，值为 `/`，然后重新运行工作流。当前默认 `github.io/sumikko-spire/` 地址不需要这个变量。

## 浏览器和存档

- 推荐较新的 Chrome、Edge、Firefox、Safari；页面需要 ES2022、structuredClone、本地存储和 Web Audio API。较老浏览器不作兼容保证。
- 手机以触摸操作，手牌可以横向滑动，地图和说明通过顶部按钮打开。音效需要先开启，再点击出牌才能播放。
- 存档及导入的角色图片只保存在各自浏览器。朋友之间互不影响。
- 从旧 ChatGPT Site 切换到 GitHub Pages 会更换网站来源，所以旧站存档和自定义角色图片不会自动迁移；旧站的数据仍留在原浏览器来源中。
- 导入本地角色图只对导入者可见，不会自动上传给朋友。如希望每位朋友看到相同图片，需要更改并提交 `public/art/ebifurai.png`，再重新部署。

## 出现问题时

- **Pages 提示升级套餐**：仓库仍是私有且当前套餐不支持；免费方案需要先确认并公开仓库。
- **deploy 显示 Skipped**：检查仓库已公开、运行分支是 main，且本次事件不是 Pull Request。公开后手动 Run workflow。
- **Get Pages site failed / 404**：先 Settings → Pages → Source = GitHub Actions，再重跑工作流。
- **403 / Resource not accessible by integration**：工作流已声明 `pages: write` 和 `id-token: write`。检查仓库/组织是否禁止 Pages、Actions、官方 actions，或 `github-pages` environment 是否限制 main。
- **白屏或资源 404**：确保分享的是 `/sumikko-spire/` 完整路径；查看 Actions 构建日志中的 base，确认没有为默认项目站点设置错误的 `PAGES_BASE_PATH`。
- **修改后暂未更新**：等 deploy 成功后再刷新；电脑可使用 Ctrl+Shift+R，手机可重新打开页面。
- **手机没有声音**：先打开设置中的音效开关，再点击卡牌；同时检查设备静音、媒体音量及浏览器设置。

## 验证记录

本次发布准备已通过以下本地检查：

- 17 项游戏规则测试（包含 20 个随机种子的完整旅程模拟）。
- 根路径和 `/sumikko-spire/` 子路径的生产构建。
- 严格静态服务器上的 1440px 电脑视口、390px/360px 手机触摸视口，无页面横向溢出。
- JS、CSS、角色图片和网页图标加载正常，测试中没有资源 404 或页面脚本错误。
- 音效在点击操作后 AudioContext 进入 running 状态。
- 源码 ZIP 实际下载成功、压缩包校验通过，包含工作流与部署文档。
- 刷新后能继续保存的回合。
- 在 `/sumikko-spire/` 子路径下，用真实界面执行 101 次操作并完成第 9 层首领通关。
- 工作流 YAML 结构、main 触发器和 Pages 权限配置。

移动视口属于 Chromium 仿真；没有进行真机 iOS Safari 或 Firefox 引擎测试。GitHub 线上构建、Pages 启用与公网可访问性需在仓库启用后，以实际 Actions 运行结果核实。
