# 全站点击跳转与返回审查

审查日期：2026-08-29

## 审查范围

- 悬浮 Logo 导航：`/`、`/#about`、`/#case-studies`、`/#works-gallery`、`/#skills`、`/#interests`、`/#contact`
- 首页联系入口与联系区链接
- 2 个经历卡片及详情页返回
- 4 个兴趣卡片、详情页返回与“和我聊聊”
- `/works`、`/about`、`/list` 页面及返回
- 浏览器后退、前进、刷新、深链直达和连续快速点击

## 结论

当前问题不是某一个按钮写错，而是全站路由、转场和滚动恢复由多套机制同时控制。

1. `AnimatePresence mode="wait"` 让旧页面先完整淡出，再挂载新页面；新页面又从 `opacity: 0` 开始淡入。340ms 内用户会看到旧页、页面底色或低透明度首页，因此产生“先闪首页再进入/返回”的视觉错误。
2. `App.tsx` 同时使用全局捕获阶段点击拦截、`pushState`、`popstate`、`hashchange`、160ms 地址轮询、多个延迟滚动任务和 sessionStorage。多个来源都能写路由和滚动，存在竞态和重复渲染。
3. `index.html` 与 `getInitialRoute()` 都会主动删除 `/#skills` 的 hash。实际验证：直达或刷新 `/#skills` 后 URL 变成 `/`，滚动停在首页顶部。
4. 返回首页会在 80、200、420、760、1200、1900ms 重复强制写入滚动位置；用户已开始滚动后仍可能被拉回，造成返回抖动。
5. “返回”有时调用 `history.back()`，有时又 `pushState()` 到锚点，历史语义不一致；同页 hash 也总是新增历史项。
6. 未知 pathname 会静默渲染首页而不修正 URL，错误链接也会看起来像“先跳首页”。
7. 全页转场没有统一遵守 `prefers-reduced-motion`，路由变化后也没有把键盘焦点移动到目标页标题。

## 修复提示词

```text
请直接审查并修复当前 React + Vite 作品集项目中“所有点击跳转与返回会闪首页、跳错页、滚动抖动”的问题。不要只修截图里的单个按钮，要覆盖全站全部站内导航入口、浏览器前进/后退、刷新和深链直达。

项目现状与已确认根因：
- src/App.tsx 手写了全局 document click 捕获、history.pushState、popstate、hashchange、160ms URL 轮询、sessionStorage 和多组 setTimeout 滚动恢复，它们会竞争写入路由与滚动状态。
- src/App.tsx 底部使用 AnimatePresence mode="wait"，整个页面 initial opacity 为 0、exit opacity 为 0、duration 0.34s。旧页会先退出，新页再从透明状态进入，导致点击和返回时出现完整首页/旧页/底色闪帧。
- index.html 与 src/App.tsx 的 getInitialRoute 都会把 /#skills 改写成 /，所以技能锚点刷新或直达必然回到首页顶部。
- 返回首页会在 80、200、420、760、1200、1900ms 多次强制 scrollTo，可能在用户开始操作后仍把页面拉回。
- 未知路径当前静默回退渲染 HomePage，错误路径会伪装成首页闪现。

请按以下顺序工作：

1. 先读取当前工作区和 git diff，保留用户已有的未提交修改、视觉样式、文案、图片、3D 交互和页面结构。只重构导航、路由、转场、滚动恢复和必要的可访问性行为。

2. 建立唯一的路由状态来源。优先使用 react-router-dom 的 BrowserRouter、Routes、Route、Link/NavLink、useNavigate、useLocation；如果决定不增加依赖，也必须封装成一个单一 router hook。不得继续混用全局 document 点击代理、160ms 地址轮询和多处手写 history 状态同步。站内链接使用路由 Link，mailto、tel、外部 URL、download、新标签和带修饰键点击保持浏览器原生行为。

3. 明确定义并实现这些路由：
- `/`：首页
- `/works`：作品页
- `/about` 与 `/list`：关于页（保留当前兼容关系，必要时使用 replace 重定向到唯一规范路径）
- `/cases/:slug`：经历详情
- `/interests/:slug`：兴趣详情
- 未知路径：显示明确的 Not Found 页面，或使用 replace 做一次明确重定向；禁止在错误 pathname 下静默渲染首页。

4. 移除会产生错误中间帧的全页转场。删除 AnimatePresence mode="wait" 对整页的包裹，或改成不会先展示旧页、不会让首页从 opacity 0 挂载的方案。首屏和路由切换时不能出现完整旧页、低透明度首页或纯底色间隙。若保留轻量动画，使用 initial={false} 或仅给页内局部元素做动画，并遵守 prefers-reduced-motion。不要改变现有视觉设计。

5. 统一锚点行为：`#about`、`#case-studies`、`#works-gallery`、`#skills`、`#interests`、`#contact` 均可从首页和任意详情页进入；URL 必须保留正确 hash；刷新和复制链接直达后必须滚到对应区块。删除 index.html 和 getInitialRoute 中所有专门清除 `#skills` 的逻辑。点击当前已经激活的同一 hash 时只滚动，不制造重复历史记录。

6. 统一滚动规则：
- 从首页进入经历或兴趣详情时，目标页在首次绘制前定位到顶部。
- 从详情返回时，优先回到进入前的首页精确滚动位置；若没有有效来源记录，回到对应 fallback：经历为 `/#case-studies`，兴趣为 `/#interests`。
- 浏览器后退/前进与页面内“返回”行为一致，不新增多余历史项，不形成返回循环。
- 用一次可取消的 useLayoutEffect/requestAnimationFrame 或路由库的滚动恢复机制完成定位；删除 80～1900ms 的重复 scrollTo 和 0～1040ms 的重复 hash 重试。恢复完成后不得继续覆盖用户滚动。

7. 为详情页返回按钮定义一致语义：只有在当前 history entry 确认来自站内有效列表/首页时才 navigate(-1)；直接打开详情页、刷新详情页或来源不可验证时，使用 replace 导航到相应 fallback hash。不能依靠陈旧 sessionStorage 误返回另一个卡片位置。

8. 路由变化后处理焦点：详情页和独立页把焦点移动到主标题或 main 容器；hash 跳转保持目标可见；为当前导航项提供 aria-current。不要破坏悬浮 Logo 菜单、键盘访问、Ctrl/Cmd 点击、中键打开新标签等原生交互。

9. 覆盖并逐项验证以下所有入口：
- 悬浮 Logo 菜单：首页、关于我、经历、作品、技能、兴趣、联系。
- 首页 Hero 联系按钮。
- 两个经历卡片：mingming、hengqian；各自详情返回。
- 四个兴趣卡片：sports、travel、singing、reading；各自详情返回；详情“和我聊聊”。
- 联系区：tel、mailto、微信/联系锚点；不得错误拦截外部协议。
- `/works`、`/about`、`/list` 的返回首页。
- 浏览器后退、前进、连续后退、刷新、直接粘贴深链、同一链接重复点击、快速连续点击。
- 桌面和移动视口。

10. 增加针对路由与滚动行为的回归验证。项目若已有浏览器测试框架就补自动化测试；若没有，不要为了这次修复引入沉重测试栈，但至少输出可复现的测试矩阵，并用浏览器实际执行。检查 0ms、80ms、200ms、400ms 的过渡画面，确保没有错误首页/旧页闪帧。

完成标准：
- 每次站内点击只产生一次预期 URL 变化和一次目标页渲染。
- 点击进入详情时不先显示首页；点击返回时不先显示首页首屏或低透明度首页。
- 所有 hash 点击、刷新和深链直达均到正确区块，尤其是 `/#skills`。
- 返回列表保持原滚动位置且不抖动；恢复后用户滚动不会被定时任务拉回。
- 浏览器后退/前进顺序正确，没有重复历史项和返回循环。
- 不拦截 mailto、tel、外链、download、新标签及修饰键点击。
- 无新增控制台错误，TypeScript 构建通过。
- 不改变当前视觉、内容、响应式布局、3D 模块和用户未提交的其他修改。

完成后请提供：
1. 根因与修复策略摘要。
2. 修改文件清单和关键代码说明。
3. 全部点击入口的测试结果表，列出入口、预期 URL、实际 URL、返回位置、闪帧结果。
4. 构建与浏览器验证结果。
5. 仍存在的风险（若无请明确写“无已知阻塞风险”）。
```
