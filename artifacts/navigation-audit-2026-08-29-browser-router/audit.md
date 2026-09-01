# 作品集路由修复审计

## 结论

通过。React Router 7.18.3 已成为唯一 URL 状态源；全部指定站内入口、详情返回、浏览器历史、hash 深链、刷新与移动视口均已在真实本地网页中执行。未发现新增控制台错误或生产依赖漏洞。

## 审计范围

- 本地成品：`http://127.0.0.1:4174/`
- 浏览器：Codex in-app Browser
- CSS 视口验证：约 1454×909、727×454、394×852
- 路由：`/`、`/works`、`/about`、`/list`、`/cases/:slug`、`/interests/:slug`、未知路径
- 锚点：`#about`、`#case-studies`、`#works-gallery`、`#skills`、`#interests`、`#contact`

## 证据步骤

1. 首页首屏 — 健康。首帧标题与人像 opacity 均为 1，没有整页透明包裹。
2. Logo 菜单 — 健康。桌面和移动的 7 个入口全部得到唯一预期 URL；当前项有 `aria-current`。
3. Hash 深链与刷新 — 健康。6 个 hash 的直达与刷新均保留 URL 并到达目标；`/#skills` 重复验证通过。
4. 经历详情 — 健康。mingming、hengqian 均从首页进入、顶部渲染、按钮返回精确位置；浏览器前进/后退一致。
5. 兴趣详情 — 健康。sports、travel、singing、reading 均从首页进入并返回精确位置；“和我聊聊”到 `/#contact`。
6. 独立页 — 健康。`/works`、`/about`、`/list` 直达、焦点转移和返回首页通过。
7. 历史顺序 — 健康。`/ → /#about → /#skills` 的连续后退与前进顺序正确，无重复项。
8. 原生链接 — 健康。实际点击 tel、mailto 后站内 URL 不变；Ctrl/中键点击不触发当前页 SPA 导航。
9. 刷新详情返回 — 健康。直接打开或刷新详情后，“返回”以 replace 到对应 fallback hash，不依赖陈旧存储。
10. 未知路径 — 健康。显示独立“页面不存在”，未渲染首页 Hero。

## 入口测试矩阵

| 入口 | 预期 URL | 实际 URL | 返回/位置 | 闪帧 |
|---|---|---|---|---|
| Logo 首页 | `/` | `/` | 顶部 0 | 无 |
| Logo 关于我 | `/#about` | `/#about` | 目标顶部 28px | 无 |
| Logo 经历 | `/#case-studies` | `/#case-studies` | 目标顶部 28px | 无 |
| Logo 作品 | `/#works-gallery` | `/#works-gallery` | 目标顶部 28px | 无 |
| Logo 技能 | `/#skills` | `/#skills` | 目标顶部 28px | 无 |
| Logo 兴趣 | `/#interests` | `/#interests` | 目标顶部 28px | 无 |
| Logo 联系 | `/#contact` | `/#contact` | 桌面/移动均可见；短页达到最大滚动 | 无 |
| Hero 联系 | `/#contact` | `/#contact` | 目标顶部 28px | 无 |
| 经历 mingming | `/cases/mingming` | `/cases/mingming` | 桌面 3874px；移动 3404px | 0/80/200/400ms DOM 均为详情 |
| 经历 hengqian | `/cases/hengqian` | `/cases/hengqian` | 桌面 4535px；移动 4191px | 无 |
| 兴趣 sports | `/interests/sports` | `/interests/sports` | 桌面 6553px；移动 6227px | 无 |
| 兴趣 travel | `/interests/travel` | `/interests/travel` | 桌面 6656px；移动 6851px | 无 |
| 兴趣 singing | `/interests/singing` | `/interests/singing` | 桌面 6553px；移动 7522px | 无 |
| 兴趣 reading | `/interests/reading` | `/interests/reading` | 桌面 6656px；移动 8170px | 无 |
| 兴趣“和我聊聊” | `/#contact` | `/#contact` | 浏览器后退回原详情顶部 | 无 |
| 电话 | `tel:13999854204` | 原生协议 | 站内 URL 不变 | 不适用 |
| 邮箱 | `mailto:1489363185@qq.com` | 原生协议 | 站内 URL 不变 | 不适用 |
| 微信锚点 | `/#contact` | `/#contact` | 同 hash 双击不新增历史项 | 无 |
| `/works` 返回 | `/` | `/` | 顶部 0 | 无 |
| `/about` 返回 | `/` | `/` | 顶部 0 | 无 |
| `/list` 返回 | `/` | `/` | 顶部 0 | 无 |
| 刷新经历详情返回 | `/#case-studies` | `/#case-studies` | fallback 顶部 28px | 无 |
| 刷新兴趣详情返回 | `/#interests` | `/#interests` | fallback 顶部 28px | 无 |
| 未知路径 | 原 pathname + 404 | `/not-a-real-page` + 404 | 明确返回首页 | 无首页伪装 |

## 转场取样

- 进入 `/cases/mingming` 后 0、80、200、400ms 的 DOM 均为 `鸣鸣很忙`，scrollY 为 0，首页 Hero 不存在。
- 80、200、400ms 的可视截图均为详情页；返回后的首个稳定截图为原卡片位置。
- 浏览器截图接口在点击同一任务的“绝对 0ms”可能返回上一张 compositor buffer；因此 0ms 用同步 DOM/URL/scroll 状态验证，视觉证据从下一次可捕获帧开始。没有观察到 340ms 旧页退出、透明首页或底色间隙。

## 可访问性与交互

- 独立页与详情页路由后焦点位于主标题。
- Hash 目标获得程序化焦点并保持可见。
- Logo 菜单打开后 7 个链接均为 `tabIndex=0`；当前导航项有 `aria-current="page"`。
- 修饰键和中键不会被自定义导航处理器拦截；in-app Browser 未暴露其新建标签页句柄，因此只确认当前页保持不变及原生 href 保留。
- 截图不能证明完整 WCAG 合规；本次只核对路由相关焦点、语义和键盘可达状态。

## 构建与运行结果

- `npm run build`：通过。
- `git diff --check`：通过，仅有工作区既有 CRLF 提示。
- `npm audit --omit=dev`：0 个生产依赖漏洞。
- 浏览器控制台 error：0。
- 非阻塞既有警告：3D 依赖发出 `THREE.Clock` deprecated 警告；Vite 提示 3D chunk 超过 500kB。

## 截图索引

- `01-home-desktop.png`
- `03-case-detail-desktop.png`
- `08-not-found.png`
- `09-skills-deep-link-desktop.png`
- `11-interest-detail-mobile.png`
- `12-interest-detail-desktop.png`

## 风险

无已知阻塞风险。

非阻塞证据限制：in-app Browser 截图与 CSS 视口使用高 DPR，截图尺寸和 DOM 验证尺寸分别记录；路由行为已在约 1454×909 与 394×852 CSS 视口复验。
