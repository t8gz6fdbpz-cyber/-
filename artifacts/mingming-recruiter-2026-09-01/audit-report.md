# 鸣鸣很忙案例页：Product Design 审计与验收报告

日期：2026-09-01  
目标页面：`/cases/mingming`  
目标岗位：IP 制作人  
验证环境：React 18 + Vite 5 + React Router；Codex 应用内浏览器；1920×1080、1440×900、768×1024、390×844。

## 1. 审计步骤与结论

### 1.1 修改前视觉审计

证据：

- [桌面首屏](./baseline/01-top-1440.png)
- [桌面视频区](./baseline/02-video-1440.png)
- [桌面 IP 区](./baseline/03-ip-1440.png)
- [桌面 Agent 区](./baseline/04-agent-1440.png)
- [移动首屏](./baseline/05-top-390.png)
- [移动 IP 区](./baseline/06-ip-390.png)

发现：

1. Hero 只有3项结果，职位、能力与成果的30秒阅读路径不完整。
2. 两个视频项目显示黑色失效播放器和可见替换说明，形成明显空白。
3. IP 区数字在移动端单列堆叠，标题出现不自然断行，页面纵向过长。
4. AI Agent 标题与实际证据之间存在大块空白，真实项目、自动化与能力矩阵互相割裂。
5. 业务文案散落在 JSX，后续替换需要同时改数据、结构和样式。
6. 手机截图采用偏强裁切，存在截掉粉丝数或成绩信息的风险。

### 1.2 信息层级修复

最终阅读顺序：

1. Hero：`CASE 01 / IP 制作人`、一句定位、4项结果。
2. AI长视频：2人协作结论、2个一致结构的项目、每项3个成果点、16:9封面。
3. 全民IP：4项结果、4项业务能力、12组账号、3类工具与4步复盘、10场训练营、30张成绩证据。
4. AI Agent：Codex真实项目、4步协作路径、1套自动化工作流、8项能力矩阵。
5. 总结与下一案例。

30秒招聘方测试：

| 问题 | 页面答案 |
|---|---|
| 应聘什么职位？ | 首屏直接显示“IP 制作人”。 |
| 最强能力是什么？ | AI长视频、IP孵化、AI Agent/自动化三条主线。 |
| 有哪些量化结果？ | 2部、20+、1万+、10场首屏可见；1个月、12/17/13/30、3/4/8/1在对应章节可见。 |
| 有什么真实证据？ | 12组账号截图、3类运营工具、10张训练营、17张普通达人、13张高管、1张自动化工作流。 |
| 是否会用AI完成实际项目？ | Codex协作开发、Browser验收、自动化工作流及4步路径可见。 |
| 是否能从想法推进到交付？ | 两个视频项目各有职责与交付物；Agent路径覆盖拆解、执行、验收与迭代。 |

### 1.3 最终视觉审计

证据：

- [1920桌面首屏](./final/01-hero-1920.png)
- [1440桌面首屏](./final/02-hero-1440.png)
- [1440视频区](./final/03-video-1440.png)
- [1440 IP区](./final/04-ip-1440.png)
- [1440 Agent区](./final/05-agent-1440.png)
- [768平板首屏](./final/06-hero-768.png)
- [390手机首屏](./final/07-hero-390.png)
- [390手机 IP区](./final/08-ip-390.png)
- [390手机 Agent区](./final/09-agent-390.png)

1440×900实测章节长度：

| 章节 | 高度 | 视口数 | 目标 |
|---|---:|---:|---|
| Hero | 853px | 0.95 | 约1 |
| AI长视频 | 1918px | 2.13 | 2–3 |
| 全民IP | 4825px | 5.36 | 5–6 |
| AI Agent | 2291px | 2.55 | 约2–2.5 |
| 总结 | 815px | 0.91 | 约0.8–1 |

结论：品牌黑/米白/橙红体系、左侧JW安全区和既有页面结构保留；标题、数字、证据图和正文共享统一内容基线。移动端 Hero 为2×2数字，IP标题固定为“全民IP / 孵化项目”两行，未出现横向滚动。

## 2. 真实素材盘点

磁盘与页面最终使用数量：

| 类型 | 数量 | 状态 |
|---|---:|---|
| 账号增长截图 | 12 | 全部存在并显示；按7.1万→5103排序 |
| 训练营图片 | 10 | 全部存在；桌面5张/页，共2页 |
| 普通达人成绩 | 17 | 全部存在；桌面9+8，共2页 |
| 高管成绩 | 13 | 全部存在；4张主页 + 9张单条视频 |
| 投放/运营工具 | 3 | 本地推、巨量AD、企业号 |
| AI自动化截图 | 1 | 只渲染一次 |
| AI长视频项目 | 2 | 未发现MP4/WebM/MOV |
| 启用的视频封面 | 2 | Pexels网络参考素材，已本地化并在数据中标记 `temporaryAsset: true` |

浏览器最终统计为59张图片、59个唯一来源、0重复、0损坏、0待加载。未生成或修改任何账号、投放、培训或成绩证据。

网络参考封面来源：

- 浙江：[Pexels retail teamwork photo](https://www.pexels.com/photo/a-man-and-a-woman-doing-business-7679473/)
- 石家庄：[Pexels musicians preparing photo](https://www.pexels.com/photo/musicians-preparing-for-concert-17513729/)

## 3. 站内导航与浏览器测试矩阵

### 3.1 Logo、Hero、详情与独立页

| 入口 | 预期URL | 实际URL | 返回/落点 | 闪帧 |
|---|---|---|---|---|
| Logo：首页 | `/` | `/` | 顶部 | 无 |
| Logo：关于我 | `/#about` | `/#about` | target top 32px | 无 |
| Logo：经历 | `/#case-studies` | `/#case-studies` | target top 32px | 无 |
| Logo：作品 | `/#works-gallery` | `/#works-gallery` | target top 28px | 无 |
| Logo：技能 | `/#skills` | `/#skills` | target top 32px | 无；刷新仍保留hash |
| Logo：兴趣 | `/#interests` | `/#interests` | target top 32px | 无 |
| Logo：联系 | `/#contact` | `/#contact` | 联系区可见 | 无 |
| Hero联系按钮 | `/#contact` | `/#contact` | 联系区可见 | 无 |
| 经历：mingming | `/cases/mingming` | `/cases/mingming` | 返回原卡片区域；代表性精确复测误差5px | 0/80/200/400ms均为目标页 |
| 经历：hengqian | `/cases/hengqian` | `/cases/hengqian` | 返回经历卡片区域 | 0/80/200/400ms均为目标页 |
| 兴趣：sports | `/interests/sports` | `/interests/sports` | 返回兴趣卡片区域 | 无 |
| 兴趣：travel | `/interests/travel` | `/interests/travel` | 返回兴趣卡片区域 | 无 |
| 兴趣：singing | `/interests/singing` | `/interests/singing` | 返回兴趣卡片区域 | 无 |
| 兴趣：reading | `/interests/reading` | `/interests/reading` | 返回兴趣卡片区域 | 无 |
| 四个兴趣“和我聊聊” | `/#contact` | 4/4为`/#contact` | 联系区可见 | 无 |
| `/works` 返回首页 | `/` | `/` | 顶部 | 无 |
| `/about` 返回首页 | `/` | `/` | 顶部 | 无 |
| `/list` 返回首页 | `/` | `/` | 顶部 | 无 |
| 未知路径 | 明确Not Found | `/missing-route` + “页面不存在” | 不伪装首页 | 无 |

联系方式：`tel:13999854204`、`mailto:1489363185@qq.com` 保持原生协议链接；微信条目是 `/#contact`。路由组件不处理协议链接。Ctrl/Cmd点击详情卡时当前页URL保持不变，未被SPA代理劫持。

### 3.2 历史、刷新、快速操作

| 测试 | 结果 |
|---|---|
| 首页→鸣鸣→浏览器后退→前进→后退 | `/`→`/cases/mingming`→`/`→`/cases/mingming`→`/`，无循环 |
| 详情页内“返回重点经历” | 有有效首页来源时 `navigate(-1)`；刷新/直达时replace到 `/#case-studies` |
| 兴趣页“返回” | 有有效首页来源时后退；刷新/直达时replace到 `/#interests` |
| 同一 `/#skills` 重复点击 | URL不变；一次后退即离开该hash，无重复历史项 |
| 快速双击鸣鸣卡片 | 只进入一次 `/cases/mingming`；一次后退回首页 |
| 返回后用户再滚动300px并等待2秒 | 位置保持，等待后变化0px |
| 刷新 `/#skills` | URL仍为 `/#skills`；目标top 32px |
| 刷新 `/cases/mingming` | H1为“鸣鸣很忙”，首屏top 0 |
| 深链 `/works`、`/about`、`/list`、详情与兴趣 | 全部按对应页面渲染 |
| 路由焦点 | 详情H1获得焦点；hash目标section获得焦点；当前菜单项有`aria-current="page"` |

路由帧证据：

- 进入详情：[0ms](./final/flash-frames/enter-000ms.png) / [80ms](./final/flash-frames/enter-080ms.png) / [200ms](./final/flash-frames/enter-200ms.png) / [400ms](./final/flash-frames/enter-400ms.png)
- 返回列表：[0ms](./final/flash-frames/back-000ms.png) / [80ms](./final/flash-frames/back-080ms.png) / [200ms](./final/flash-frames/back-200ms.png) / [400ms](./final/flash-frames/back-400ms.png)

## 4. 轮播、Tab与可访问性

| 控件 | 实测结果 |
|---|---|
| 训练营轮播 | 桌面 `1/2→2/2`；URL不变 |
| 普通达人成绩轮播 | 键盘 ArrowRight `1/2→2/2`；URL不变 |
| 高管分类Tab | `aria-selected`正确；URL不变 |
| 高管二级Tab | 账号主页/单条视频切换正确；URL不变 |
| 高管视频轮播 | `1/2→2/2`；第二页资源全部加载 |
| Tab容器稳定性 | 普通达人→高管切换前后均1162px，高度变化0px |
| 移动轮播 | 每屏2张；训练营5页、普通达人9页，符合1–2张/屏 |
| 触控目标 | 轮播按钮CSS最小高度44px；焦点轮廓保留 |
| reduced motion | Mingming作用域内动画/过渡缩短至0.01ms |

## 5. 技术验证

- `npm run build`：通过。
- TypeScript：通过，无未使用导入错误。
- Vite：2500模块构建完成。
- 控制台error：0。
- React key警告：0。
- 图片资源：59/59完成，0损坏，0重复。
- 四视口横向溢出：1920、1440、768、390均为false。
- 未恢复全局点击代理、URL轮询、sessionStorage滚动状态、多组setTimeout或全页`AnimatePresence mode="wait"`。
- 存在一个非阻塞的既有依赖警告：Three.js提示`THREE.Clock`已弃用；不由本次路由或Mingming改动引入。
- Vite仍提示3D chunk大于500kB；属于既有3D模块体积，不影响本次页面与路由验收。

## 6. 后期替换清单

数据层 `replacementChecklist` 已记录：

1. 浙江区域招商宣传片源文件。
2. 石家庄城市主题宣传片源文件。
3. 两支宣传片最终封面。
4. 项目最终数据与发布日期。

只需在 `src/data/mingmingCase.ts` 填入 `videoSrc` 或替换 `poster`；当 `videoSrc` 存在时页面会自动切换为带`controls`、`playsInline`、`preload="metadata"`的16:9播放器。

## 7. 最终结论

页面从“存在占位、信息重复、移动端过长、Agent碎片化”调整为“职位与结果优先、证据紧随、后续替换集中化”的招聘方阅读结构。所有已确认正式数字均来自用户提供的数据；没有添加播放量、ROI、GMV、收入、转化率等未确认指标。

无已知阻塞风险。非阻塞后续项只有：替换两支真实视频及最终封面、补项目发布日期、未来单独处理既有Three.js弃用警告与3D chunk体积。

## 8. 修改文件与关键代码

### 路由与滚动

- `src/App.tsx`：改为 `BrowserRouter`、`Routes`、显式动态路由与明确的 Not Found；移除全页等待退场动画。
- `src/routing.tsx`：集中处理站内 Link、详情来源、一次性滚动恢复、hash 定位与路由焦点；不再轮询 URL 或使用多组定时器。
- `src/main.tsx`、`package.json`、`package-lock.json`：接入 `react-router-dom` 并保持单一 BrowserRouter 边界。
- `src/components/ui/FloatingLogoNav.tsx`：全部站内入口改用路由链接并提供 `aria-current`。
- `src/components/sections/HeroSection.tsx`、`CaseStudiesPreviewSection.tsx`、`InterestsSection.tsx`、`ContactSection.tsx`、`AboutSection.tsx`：替换站内导航入口，同时保留 `tel:`、`mailto:`、修饰键、新标签等原生行为。
- `src/pages/CaseStudyPage.tsx`、`InterestPage.tsx`、`WorksPage.tsx`、`ListPage.tsx`、`NotFoundPage.tsx`：统一独立页焦点、详情返回语义、fallback hash 与错误路由显示。

### 鸣鸣案例页

- `src/pages/MingmingCasePage.tsx`：重组招聘方阅读层级、三类证据轮播、双层 Tab、Agent 项目与替换逻辑。
- `src/data/mingmingCase.ts`：集中 hero、视频、账号、培训、达人、高管、Agent、替换清单与素材来源。
- `src/components/ui/ReactBitsEvidence.tsx`：提供稳定高度、键盘可操作的证据轮播与 Tab。
- `src/styles/mingming-hierarchy.css`、`src/styles/globals.css`：保留原视觉语言，修复桌面密度、移动断行、证据图裁切、触控尺寸与 reduced-motion。
- `public/assets/cases/mingming/`：复用真实项目证据；两张临时视频封面采用可追溯的 Pexels 网络参考图，未再生成新图。
